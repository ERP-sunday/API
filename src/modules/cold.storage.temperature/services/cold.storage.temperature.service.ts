import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException,} from '@nestjs/common';
import {ColdStorageTemperatureRepository} from "../repositories/cold.storage.temperature.repository";
import {ColdStorageRepository} from "../../cold.storage/repositories/cold.storage.repository";
import {ColdStorageTemperatureDTO} from "../dto/cold.storage.temperature.dto";
import {ColdStorageTemperature} from "../models/cold.storage.temperature.model";
import {Types} from "mongoose";
import {ColdStorageTemperaturePatchDTO} from "../dto/cold.storage.temperature.patch.dto";

@Injectable()
export class ColdStorageTemperatureService {
  constructor(
      private readonly coldStorageTemperatureRepository: ColdStorageTemperatureRepository,
      private readonly coldStorageRepository: ColdStorageRepository
  ) {}

  async getAllColdStorageTemperatures(day?: number, month?: number, year?: number) {
    try {
      const filter: any = {};

      if (year !== undefined) {
        if (isNaN(year) || year < 1970) {
          throw new BadRequestException('Invalid year format');
        }

        // Si mois et jour sont fournis, on cible une seule journée
        if (month !== undefined && day !== undefined) {
          if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
            throw new BadRequestException('Invalid day or month format');
          }

          const startDate = new Date(year, month - 1, day, 0, 0, 0);
          const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
          filter.date = { $gte: startDate, $lte: endDate };

        } else if (month !== undefined) {
          if (isNaN(month) || month < 1 || month > 12) {
            throw new BadRequestException('Invalid month format');
          }

          const startDate = new Date(year, month - 1, 1);
          const endDate = new Date(year, month, 0, 23, 59, 59, 999);
          filter.date = { $gte: startDate, $lte: endDate };

        } else {
          // Si seulement l’année est fournie
          const startDate = new Date(year, 0, 1);
          const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
          filter.date = { $gte: startDate, $lte: endDate };
        }
      }

      const temperatures = await this.coldStorageTemperatureRepository.findManyBy(filter, {
        populate: [{ path: 'coldStorageId' }],
      });

      return temperatures.map(({ coldStorageId, ...rest }) => ({
        ...rest,
        coldStorage: coldStorageId,
      }));

    } catch (error) {
      console.error('Error fetching filtered temperatures:', error);
      throw new InternalServerErrorException(error.message || 'Something went wrong');
    }
  }

  async getColdStorageTemperatureById(coldStorageTemperatureId: string) {
    try {
      const temperature = (await this.coldStorageTemperatureRepository.findOneById(
          coldStorageTemperatureId,
          // @ts-ignore
          { populate: [{ path: 'coldStorageId', select: 'name' }] }
      )) as ColdStorageTemperature;

      return {
        ...temperature,
        coldStorage: temperature.coldStorageId,
        coldStorageId: undefined,
      }
    } catch {
      throw new NotFoundException();
    }
  }

  async createTemperatures(parameters: ColdStorageTemperatureDTO[]) {
    try {
      const results = [];

      for (const coldStorageTemp of parameters) {
        const { coldStorageId, date, morningTemperature, eveningTemperature } = coldStorageTemp;

        // Vérifie que le cold storage existe
        await this.coldStorageRepository.findOneById(coldStorageId);

        // Recherche une température existante pour le même coldStorageId et la même date (en ignorant l'heure)
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const existing = await this.coldStorageTemperatureRepository.findOptionalBy({
          coldStorageId: new Types.ObjectId(coldStorageId),
          date: { $gte: startOfDay, $lte: endOfDay },
        });

        if (existing) {
          // Mise à jour si une température existe déjà
          const updatePayload: Partial<Omit<ColdStorageTemperature, 'coldStorageId'>> = {};

          if (morningTemperature !== null && morningTemperature !== undefined) {
            updatePayload.morningTemperature = morningTemperature;
          }

          if (eveningTemperature !== null && eveningTemperature !== undefined) {
            updatePayload.eveningTemperature = eveningTemperature;
          }

          await this.coldStorageTemperatureRepository.updateOneBy(
              { _id: existing._id },
              updatePayload
          );

          results.push(await this.coldStorageTemperatureRepository.findOneById(existing._id.toString(), {
            populate: ['coldStorageId']
          }));
        } else {
          // Création sinon
          const inserted = await this.coldStorageTemperatureRepository.insert({
            coldStorageId: new Types.ObjectId(coldStorageId),
            date: new Date(date),
            morningTemperature,
            eveningTemperature,
          });

          results.push(await this.coldStorageTemperatureRepository.findOneById(inserted._id.toString(), {
            populate: ['coldStorageId']
          }));
        }
      }

      // Formatage de la réponse
      return results.map(e => ({
        ...e,
        coldStorage: e.coldStorageId,
        coldStorageId: undefined,
      }));
    } catch (error) {
      throw new BadRequestException(error.message || 'Invalid request');
    }
  }

  async updateTemperature(
      coldStorageTemperatureId: string,
      updatedColdStorageTemperature: ColdStorageTemperaturePatchDTO
  ): Promise<ColdStorageTemperature> {
    try {
      const { morningTemperature, eveningTemperature } = updatedColdStorageTemperature;

      const coldStorageTemperature = await this.coldStorageTemperatureRepository.findOneById(coldStorageTemperatureId)
      await this.coldStorageRepository.findOneById(coldStorageTemperature.coldStorageId.toString());

      const isUpdated = await this.coldStorageTemperatureRepository.updateOneBy(
          { _id: coldStorageTemperatureId },
          {
            morningTemperature: morningTemperature,
            eveningTemperature: eveningTemperature
          }
      )

      if (!isUpdated) {
        throw new NotFoundException();
      }

      return this.coldStorageTemperatureRepository.findOneById(coldStorageTemperatureId)
    } catch {
      throw new NotFoundException();
    }
  }

  async deleteColdStorageTemperature(coldStorageTemperatureId: string): Promise<void> {
    const isDeleted = await this.coldStorageTemperatureRepository.deleteOneBy({
      _id: new Types.ObjectId(coldStorageTemperatureId),
    });

    if (!isDeleted) {
      throw new NotFoundException();
    }
  }
}
