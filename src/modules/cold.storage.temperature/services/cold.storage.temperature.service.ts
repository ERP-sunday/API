import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ColdStorageTemperatureRepository } from '../repositories/cold.storage.temperature.repository';
import { ColdStorageRepository } from '../../cold.storage/repositories/cold.storage.repository';
import { ColdStorageTemperatureDTO } from '../dto/cold.storage.temperature.dto';
import { ColdStorageTemperaturePatchDTO } from '../dto/cold.storage.temperature.patch.dto';
import { ColdStorageTemperature } from '../models/cold.storage.temperature.model';
import { BaseService } from '../../../common/services/base.service';
import { DateRangeFilter } from '../../../common/filters/date.range.filter';
import { plainToInstance } from 'class-transformer';
import { ColdStorageTemperatureRanges } from '../../../common/utils/types/cold.storage.type';

@Injectable()
export class ColdStorageTemperatureService extends BaseService {
  constructor(
    private readonly coldStorageTemperatureRepository: ColdStorageTemperatureRepository,
    private readonly coldStorageRepository: ColdStorageRepository,
  ) {
    super();
  }

  async getAllColdStorageTemperatures(filter: DateRangeFilter) {
    try {
      const mongoFilter = filter.toDateFilter();
      // Appels en parallèle
      const [coldStorages, temperatures] = await Promise.all([
        this.coldStorageRepository.findAll(),
        this.coldStorageTemperatureRepository.findManyBy(mongoFilter, {
          populate: [{ path: 'coldStorageId' }],
        }),
      ]);

      // Déterminer la date du filtre (si présente)
      let filterDate: string | undefined = undefined;
      if (filter && filter.year && filter.month && filter.day) {
        // Format ISO YYYY-MM-DDT00:00:00.000Z
        filterDate = new Date(Date.UTC(filter.year, filter.month - 1, filter.day, 0, 0, 0)).toISOString();
      }

      // Associer chaque coldStorage à sa température (ou objet vide mais conforme au modèle)
      return coldStorages.map((coldStorage) => {
        const temp = temperatures.find(
          (t) => t.coldStorageId && t.coldStorageId._id.toString() === coldStorage._id.toString()
        );
        if (temp) {
          const { coldStorageId, ...rest } = temp;
          return { ...rest, coldStorage: coldStorage };
        } else {
          return {
            _id: null,
            coldStorage: coldStorage,
            date: filterDate || null,
            temperatureRecords: [],
          };
        }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async getColdStorageTemperatureById(coldStorageTemperatureId: string) {
    try {
      const temperature =
        await this.coldStorageTemperatureRepository.findOneById(
          coldStorageTemperatureId,
          { populate: [{ path: 'coldStorageId' }] },
        );

      this.assertFound(temperature, `Temperature record not found`);

      return {
        ...temperature,
        coldStorage: temperature.coldStorageId,
        coldStorageId: undefined,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private validateTimeFormat(records: { time: string }[]): void {
    const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
    
    for (const record of records) {
      if (!timeRegex.test(record.time)) {
        throw new BadRequestException(
          `Le format de l'heure "${record.time}" est invalide. Le format doit être HH:mm (ex: 14:30)`,
        );
      }
    }
  }

  private async validateTemperatures(coldStorageId: string, temperatures: { temperature: number; time: string }[]) {
    // Valider le format de l'heure
    this.validateTimeFormat(temperatures);

    // Récupérer le cold storage pour connaître son type
    const coldStorage = await this.coldStorageRepository.findOneById(coldStorageId);
    if (!coldStorage) {
      throw new NotFoundException(`ColdStorage ${coldStorageId} not found`);
    }

    const temperatureRange = ColdStorageTemperatureRanges[coldStorage.type];
    if (!temperatureRange) {
      throw new BadRequestException(`Type de stockage non reconnu: ${coldStorage.type}`);
    }

    // Vérifier chaque température
    for (const record of temperatures) {
      if (record.temperature < temperatureRange.min || record.temperature > temperatureRange.max) {
        throw new BadRequestException(
          `La température ${record.temperature}°C est hors limites pour ${coldStorage.type} (min: ${temperatureRange.min}°C, max: ${temperatureRange.max}°C)`,
        );
      }
    }
  }

  async createTemperatures(parameters: ColdStorageTemperatureDTO[]) {
    try {
      const results = [];

      for (const inputRaw of parameters) {
        const input = plainToInstance(ColdStorageTemperatureDTO, inputRaw);
        const { coldStorageId, date, temperatureRecords } = input;

        // Valider les températures selon le type de stockage
        await this.validateTemperatures(coldStorageId, temperatureRecords);

        // Création de la date en préservant la date locale
        const localDate = new Date(date);
        const startOfDay = new Date(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate(),
          0, 0, 0
        );
        const endOfDay = new Date(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate(),
          23, 59, 59, 999
        );

        const existing = await this.coldStorageTemperatureRepository.findOptionalBy({
          coldStorageId: new Types.ObjectId(coldStorageId),
          date: { $gte: startOfDay, $lte: endOfDay },
        });

        let result: ColdStorageTemperature;

        if (existing) {
          // Vérification des doublons
          const existingTimes = new Set(existing.temperatureRecords.map(r => r.time));
          const newRecords = temperatureRecords.filter(r => !existingTimes.has(r.time));
          
          if (newRecords.length !== temperatureRecords.length) {
            throw new BadRequestException(
              'Certains relevés de température existent déjà pour cette heure',
            );
          }

          // Mise à jour du relevé existant en ajoutant les nouveaux relevés
          const allRecords = [...(existing.temperatureRecords || []), ...newRecords];
          // Tri par heure
          const sortedRecords = allRecords.sort((a, b) => a.time.localeCompare(b.time));

          const update: Partial<ColdStorageTemperature> = {
            temperatureRecords: sortedRecords,
          };

          await this.coldStorageTemperatureRepository.updateOneBy(
            { _id: existing._id },
            update,
          );

          result = await this.coldStorageTemperatureRepository.findOneById(
            existing._id.toString(),
            {
              populate: ['coldStorageId'],
            },
          );
        } else {
          // Création d'un nouveau relevé
          const inserted = await this.coldStorageTemperatureRepository.insert({
            coldStorageId: new Types.ObjectId(coldStorageId),
            date: startOfDay,
            temperatureRecords: temperatureRecords,
          });

          result = await this.coldStorageTemperatureRepository.findOneById(
            inserted._id.toString(),
            {
              populate: ['coldStorageId'],
            },
          );
        }

        results.push({
          ...result,
          coldStorage: result.coldStorageId,
          coldStorageId: undefined,
        });
      }

      return results;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateTemperature(
    coldStorageTemperatureId: string,
    updateDto: ColdStorageTemperaturePatchDTO,
  ): Promise<ColdStorageTemperature> {
    try {
      const current = await this.coldStorageTemperatureRepository.findOneById(
        coldStorageTemperatureId,
      );
      this.assertFound(current, 'Temperature entry not found');

      if (updateDto.temperatureRecords) {
        // Valider les nouvelles températures
        await this.validateTemperatures(
          current.coldStorageId.toString(),
          updateDto.temperatureRecords,
        );
      }

      await this.assertFound(
        await this.coldStorageRepository.findOneById(
          current.coldStorageId.toString(),
        ),
        'Linked ColdStorage not found',
      );

      const update: Partial<ColdStorageTemperature> = {};

      // Gestion de la date
      if (updateDto.date) {
        const newDate = new Date(updateDto.date);
        newDate.setHours(0, 0, 0, 0);
        update.date = newDate;
      }

      // Gestion des temperatureRecords
      if (updateDto.temperatureRecords) {
        // Vérification des doublons avec les relevés existants
        const existingTimes = new Set(
          current.temperatureRecords
            .filter(r => !updateDto.temperatureRecords.find(ur => ur.time === r.time))
            .map(r => r.time)
        );

        const hasConflicts = updateDto.temperatureRecords.some(r => existingTimes.has(r.time));
        if (hasConflicts) {
          throw new BadRequestException(
            'Certains relevés de température existent déjà pour cette heure',
          );
        }

        // Fusion et tri des relevés
        const allRecords = [
          ...current.temperatureRecords.filter(r => 
            !updateDto.temperatureRecords.find(ur => ur.time === r.time)
          ),
          ...updateDto.temperatureRecords,
        ].sort((a, b) => a.time.localeCompare(b.time));

        update.temperatureRecords = allRecords;
      }

      const isUpdated = await this.coldStorageTemperatureRepository.updateOneBy(
        { _id: coldStorageTemperatureId },
        update,
      );

      this.assertFound(isUpdated, 'Update failed');

      return await this.coldStorageTemperatureRepository.findOneById(
        coldStorageTemperatureId,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteColdStorageTemperature(
    coldStorageTemperatureId: string,
  ): Promise<void> {
    try {
      const isDeleted = await this.coldStorageTemperatureRepository.deleteOneBy(
        {
          _id: new Types.ObjectId(coldStorageTemperatureId),
        },
      );

      this.assertFound(isDeleted, 'Temperature record not found');
    } catch (error) {
      this.handleError(error);
    }
  }
}
