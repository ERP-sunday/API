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
import { TemperatureAnomalyType } from '../enums/temperature.anomaly.enum';
import { CorrectiveActionType } from '../enums/corrective.action.enum';
import { TemperatureStatus } from '../enums/temperature.status.enum';
import { TemperatureStatusResponseDTO } from '../dto/temperature.status.response.dto';

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
      // Créer les dates de début et fin en UTC
      const startDate = new Date(
        Date.UTC(filter.year, filter.month - 1, filter.day),
      );
      const endDate = new Date(
        Date.UTC(filter.year, filter.month - 1, filter.day, 23, 59, 59, 999),
      );

      const mongoFilter = {
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      };

      // Appels en parallèle
      const [coldStorages, temperatures] = await Promise.all([
        this.coldStorageRepository.findAll(),
        this.coldStorageTemperatureRepository.findManyBy(mongoFilter, {
          populate: [{ path: 'coldStorageId' }],
        }),
      ]);

      // Associer chaque coldStorage à sa température (ou objet vide mais conforme au modèle)
      return coldStorages.map((coldStorage) => {
        const temp = temperatures.find(
          (t) =>
            t.coldStorageId &&
            t.coldStorageId._id.toString() === coldStorage._id.toString(),
        );
        if (temp) {
          const { coldStorageId, ...rest } = temp;
          return { ...rest, coldStorage: coldStorage };
        } else {
          return {
            _id: null,
            coldStorage: coldStorage,
            date: startDate,
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

  private async validateTemperatures(
    coldStorageId: string,
    temperatures: {
      temperature: number;
      time: string;
      correctiveAction?: CorrectiveActionType;
    }[],
  ) {
    // Valider le format de l'heure
    this.validateTimeFormat(temperatures);

    // Récupérer le cold storage pour connaître son type
    const coldStorage =
      await this.coldStorageRepository.findOneById(coldStorageId);
    if (!coldStorage) {
      throw new NotFoundException(`ColdStorage ${coldStorageId} not found`);
    }

    const temperatureRange = ColdStorageTemperatureRanges[coldStorage.type];
    if (!temperatureRange) {
      throw new BadRequestException(
        `Type de stockage non reconnu: ${coldStorage.type}`,
      );
    }

    // Vérifier chaque température et ajouter l'anomalie si nécessaire
    return temperatures.map((record) => {
      if (record.temperature < temperatureRange.min) {
        if (!record.correctiveAction) {
          throw new BadRequestException(
            `Une action corrective est requise pour la température ${record.temperature}°C qui est trop basse (< ${temperatureRange.min}°C)`,
          );
        }
        return { ...record, anomaly: TemperatureAnomalyType.TOO_LOW };
      }
      if (record.temperature > temperatureRange.max) {
        if (!record.correctiveAction) {
          throw new BadRequestException(
            `Une action corrective est requise pour la température ${record.temperature}°C qui est trop haute (> ${temperatureRange.max}°C)`,
          );
        }
        return { ...record, anomaly: TemperatureAnomalyType.TOO_HIGH };
      }
      // Si la température est normale, on supprime l'action corrective si elle était présente
      return {
        ...record,
        anomaly: TemperatureAnomalyType.NONE,
        correctiveAction: undefined,
      };
    });
  }

  async createTemperatures(parameters: ColdStorageTemperatureDTO[]) {
    try {
      const results = [];

      for (const inputRaw of parameters) {
        const input = plainToInstance(ColdStorageTemperatureDTO, inputRaw);
        const { coldStorageId, date, temperatureRecords } = input;

        // Valider les températures selon le type de stockage et obtenir les records avec les anomalies
        const validatedRecords = await this.validateTemperatures(
          coldStorageId,
          temperatureRecords,
        );

        // Création de la date en UTC
        const localDate = new Date(date);
        const startOfDay = new Date(
          Date.UTC(
            localDate.getFullYear(),
            localDate.getMonth(),
            localDate.getDate(),
            0,
            0,
            0,
          ),
        );
        const endOfDay = new Date(
          Date.UTC(
            localDate.getFullYear(),
            localDate.getMonth(),
            localDate.getDate(),
            23,
            59,
            59,
            999,
          ),
        );

        const existing =
          await this.coldStorageTemperatureRepository.findOptionalBy({
            coldStorageId: new Types.ObjectId(coldStorageId),
            date: { $gte: startOfDay, $lte: endOfDay },
          });

        let result: ColdStorageTemperature;

        if (existing) {
          // Vérification des doublons
          const existingTimes = new Set(
            existing.temperatureRecords.map((r) => r.time),
          );
          const newRecords = validatedRecords.filter(
            (r) => !existingTimes.has(r.time),
          );

          if (newRecords.length !== validatedRecords.length) {
            throw new BadRequestException(
              'Certains relevés de température existent déjà pour cette heure',
            );
          }

          // Mise à jour du relevé existant en ajoutant les nouveaux relevés
          const allRecords = [
            ...(existing.temperatureRecords || []),
            ...newRecords,
          ];
          // Tri par heure
          const sortedRecords = allRecords.sort((a, b) =>
            a.time.localeCompare(b.time),
          );

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
            temperatureRecords: validatedRecords,
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
        // Valider les nouvelles températures et obtenir les records avec les anomalies
        const validatedRecords = await this.validateTemperatures(
          current.coldStorageId.toString(),
          updateDto.temperatureRecords,
        );

        // Vérification des doublons avec les relevés existants
        const existingTimes = new Set(
          current.temperatureRecords
            .filter((r) => !validatedRecords.find((ur) => ur.time === r.time))
            .map((r) => r.time),
        );

        const hasConflicts = validatedRecords.some((r) =>
          existingTimes.has(r.time),
        );
        if (hasConflicts) {
          throw new BadRequestException(
            'Certains relevés de température existent déjà pour cette heure',
          );
        }

        // Fusion et tri des relevés
        const allRecords = [
          ...current.temperatureRecords.filter(
            (r) => !validatedRecords.find((ur) => ur.time === r.time),
          ),
          ...validatedRecords,
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

  async getTemperatureStatusRange(
    startDate?: string,
    endDate?: string,
  ): Promise<TemperatureStatusResponseDTO[]> {
    try {
      let start: Date;
      let end: Date;

      if (startDate && endDate) {
        // Si les deux dates sont fournies, on les utilise
        const [startYear, startMonth, startDay] = startDate
          .split('-')
          .map(Number);
        const [endYear, endMonth, endDay] = endDate.split('-').map(Number);

        start = new Date(Date.UTC(startYear, startMonth - 1, startDay));
        end = new Date(
          Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59, 999),
        );
      } else if (startDate) {
        // Si seulement la date de début est fournie, on prend jusqu'à aujourd'hui
        const [startYear, startMonth, startDay] = startDate
          .split('-')
          .map(Number);
        start = new Date(Date.UTC(startYear, startMonth - 1, startDay));
        end = new Date();
        end.setUTCHours(23, 59, 59, 999);
      } else if (endDate) {
        // Si seulement la date de fin est fournie, on prend le dernier mois
        const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
        end = new Date(
          Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59, 999),
        );
        start = new Date(end);
        start.setUTCMonth(start.getUTCMonth() - 1);
        start.setUTCHours(0, 0, 0, 0);
      } else {
        // Si aucune date n'est fournie, on prend le mois en cours
        end = new Date();
        end.setUTCHours(23, 59, 59, 999);
        start = new Date(end);
        start.setUTCDate(1);
        start.setUTCHours(0, 0, 0, 0);
      }

      const mongoFilter = {
        date: {
          $gte: start,
          $lte: end,
        },
      };

      // Appels en parallèle pour optimiser les performances
      const [coldStorages, temperatures] = await Promise.all([
        this.coldStorageRepository.findAll(),
        this.coldStorageTemperatureRepository.findManyBy(mongoFilter),
      ]);

      const totalStoragesCount = coldStorages.length;
      const statusMap = new Map<string, TemperatureStatusResponseDTO>();

      // Initialiser le Map avec toutes les dates de la plage
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        statusMap.set(dateStr, {
          date: dateStr,
          status: TemperatureStatus.MISSING,
          anomalyCount: 0,
          completedStoragesCount: 0,
          totalStoragesCount,
        });
      }

      // Analyser chaque relevé de température
      for (const temp of temperatures) {
        const dateStr = temp.date.toISOString().split('T')[0];
        const currentStatus = statusMap.get(dateStr);

        if (!currentStatus) continue; // Ignorer les dates hors plage

        // Compter les anomalies
        const anomalies = temp.temperatureRecords.filter(
          (record) =>
            record.anomaly && record.anomaly !== TemperatureAnomalyType.NONE,
        ).length;
        currentStatus.anomalyCount += anomalies;

        // Vérifier si ce frigo a au moins 2 relevés
        if (temp.temperatureRecords.length >= 2) {
          currentStatus.completedStoragesCount++;
        }

        // Mettre à jour le statut selon les règles
        // Si il y a des anomalies, elles prennent priorité
        if (currentStatus.anomalyCount > 1) {
          currentStatus.status = TemperatureStatus.CRITICAL;
        } else if (currentStatus.anomalyCount === 1) {
          currentStatus.status = TemperatureStatus.WARNING;
        } else if (
          currentStatus.completedStoragesCount === totalStoragesCount
        ) {
          // Pas d'anomalies et tous les frigos ont leurs relevés
          currentStatus.status = TemperatureStatus.NORMAL;
        } else {
          // Pas d'anomalies mais relevés incomplets
          currentStatus.status = TemperatureStatus.MISSING;
        }
      }

      // Convertir le Map en tableau et trier par date
      return Array.from(statusMap.values()).sort((a, b) =>
        a.date.localeCompare(b.date),
      );
    } catch (error) {
      this.handleError(error);
    }
  }
}
