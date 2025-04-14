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

  async getAllColdStorageTemperatures(month?: number, year?: number) {
    try {
      const filter: any = {};

      if (month !== undefined && year !== undefined) {
        if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
          throw new BadRequestException('Invalid month or year format');
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        filter.date = { $gte: startDate, $lte: endDate };
      }

      const temperatures = await this.coldStorageTemperatureRepository.findManyBy(filter, {
        populate: [{ path: 'coldStorageId', select: 'name' }],
      });

      return temperatures.map((e) => ({
        ...e,
        coldStorage: e.coldStorageId,
        coldStorageId: undefined,
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
      for (const coldStorageTemp of parameters) {
        await this.coldStorageRepository.findOneById(coldStorageTemp.coldStorageId);
      }

      const insertedTemperatures = await this.coldStorageTemperatureRepository.insertMany(
          parameters.map(temp => ({
            coldStorageId: new Types.ObjectId(temp.coldStorageId),
            date: temp.date,
            morningTemperature: temp.morningTemperature,
            eveningTemperature: temp.eveningTemperature
          }))
      );

      const insertedIds = insertedTemperatures.map(temp => temp._id);

      // Récupérer les températures avec le populate
      const populatedTemperatures = await this.coldStorageTemperatureRepository.findManyBy(
          { _id: { $in: insertedIds } },
          { populate: ['coldStorageId'] }
      );

      // Transformer le format de la réponse
      return populatedTemperatures.map(e => ({
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
      _id: coldStorageTemperatureId,
    });

    if (!isDeleted) {
      throw new NotFoundException();
    }
  }
}
