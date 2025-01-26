import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ColdStorageRepository } from 'src/modules/cold.storage/repositories/cold.storage.repository';
import { ColdStorageDTO } from '../dto/cold.storage.dto';
import { ColdStorage } from '../models/cold.storage.model';

@Injectable()
export class ColdStorageService {
  constructor(private readonly coldStorageRepository: ColdStorageRepository) {}

  async getAllColdStorages(): Promise<ColdStorage[]> {
    try {
      return (await this.coldStorageRepository.findAll()) as ColdStorage[];
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getColdStorageById(coldStorageId: string): Promise<ColdStorage> {
    try {
      return (await this.coldStorageRepository.findOneById(
        coldStorageId,
      )) as ColdStorage;
    } catch {
      throw new NotFoundException();
    }
  }

  async createColdStorage(parameters: ColdStorageDTO) {
    try {
      const { name, type } = parameters;

      const savedColdStorage = (await this.coldStorageRepository.insert({
        name: name,
        type: type,
      })) as ColdStorage;

      return await this.coldStorageRepository.findOneById(savedColdStorage._id);
    } catch {
      throw new BadRequestException();
    }
  }

  async updateColdStorage(
    coldStorageId: string,
    updatedColdStorage: ColdStorageDTO,
  ): Promise<ColdStorage> {
    const isUpdated = await this.coldStorageRepository.updateOneBy(
      { _id: coldStorageId },
      updatedColdStorage,
    );

    if (!isUpdated) {
      throw new NotFoundException();
    }

    return await this.getColdStorageById(coldStorageId);
  }

  async deleteColdStorage(coldStorageId: string): Promise<void> {
    const isDeleted = await this.coldStorageRepository.deleteOneBy({
      _id: coldStorageId,
    });

    if (!isDeleted) {
      throw new NotFoundException();
    }
  }
}
