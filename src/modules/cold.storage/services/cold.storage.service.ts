import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ColdStorageRepository } from 'src/modules/cold.storage/repositories/cold.storage.repository';
import { ColdStorageDTO } from '../dto/cold.storage.dto';
import { ColdStorage } from '../models/cold.storage.model';
import { BaseService } from '../../../common/services/base.service';

@Injectable()
export class ColdStorageService extends BaseService {
  constructor(private readonly coldStorageRepository: ColdStorageRepository) {
    super();
  }

  async getAllColdStorages(): Promise<ColdStorage[]> {
    try {
      return await this.coldStorageRepository.findAll() as ColdStorage[];
    } catch (error) {
      this.handleError(error);
    }
  }

  async getColdStorageById(coldStorageId: string): Promise<ColdStorage> {
    try {
      const coldStorage = await this.coldStorageRepository.findOneById(coldStorageId);
      return this.assertFound(coldStorage, `Cold storage ${coldStorageId} not found`) as ColdStorage;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createColdStorage(parameters: ColdStorageDTO): Promise<ColdStorage> {
    try {
      const saved = await this.coldStorageRepository.insert({
        name: parameters.name,
        type: parameters.type,
      }) as ColdStorage;

      return await this.getColdStorageById(saved._id);
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateColdStorage(
      coldStorageId: string,
      updatedColdStorage: ColdStorageDTO,
  ): Promise<ColdStorage> {
    try {
      const isUpdated = await this.coldStorageRepository.updateOneBy(
          { _id: coldStorageId },
          updatedColdStorage,
      );

      this.assertFound(isUpdated, `Cold storage ${coldStorageId} not found`);

      return await this.getColdStorageById(coldStorageId);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteColdStorage(coldStorageId: string): Promise<void> {
    try {
      const isDeleted = await this.coldStorageRepository.deleteOneBy({ _id: coldStorageId });
      this.assertFound(isDeleted, `Cold storage ${coldStorageId} not found`);
    } catch (error) {
      this.handleError(error);
    }
  }
}