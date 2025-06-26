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
            morningTemperature: null,
            eveningTemperature: null,
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
          { populate: [{ path: 'coldStorageId', select: 'name' }] },
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

  async createTemperatures(parameters: ColdStorageTemperatureDTO[]) {
    try {
      const results = [];

      for (const inputRaw of parameters) {
        const input = plainToInstance(ColdStorageTemperatureDTO, inputRaw);
        // Appel de la validation personnalisée
        try {
          input.validate();
        } catch (e) {
          throw new BadRequestException(e.message);
        }
        const { coldStorageId, date, morningTemperature, eveningTemperature, morningTime, eveningTime } =
          input;

        await this.assertFound(
          await this.coldStorageRepository.findOneById(coldStorageId),
          `ColdStorage ${coldStorageId} not found`,
        );

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const existing =
          await this.coldStorageTemperatureRepository.findOptionalBy({
            coldStorageId: new Types.ObjectId(coldStorageId),
            date: { $gte: startOfDay, $lte: endOfDay },
          });

        let result: ColdStorageTemperature;

        if (existing) {
          const update: Partial<ColdStorageTemperature> = {};
          if (morningTemperature != null)
            update.morningTemperature = morningTemperature;
          if (eveningTemperature != null)
            update.eveningTemperature = eveningTemperature;
          if (morningTime != null)
            update.morningTime = morningTime;
          if (eveningTime != null)
            update.eveningTime = eveningTime;

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
          const inserted = await this.coldStorageTemperatureRepository.insert({
            coldStorageId: new Types.ObjectId(coldStorageId),
            date: new Date(date),
            morningTemperature,
            eveningTemperature,
            morningTime,
            eveningTime,
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

      const isUpdated = await this.coldStorageTemperatureRepository.updateOneBy(
        { _id: coldStorageTemperatureId },
        // @ts-ignore
        updateDto,
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
