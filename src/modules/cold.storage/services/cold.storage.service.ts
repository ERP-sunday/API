import { BadRequestException, Injectable } from '@nestjs/common';
import { ColdStorageRepository } from 'src/modules/cold.storage/repositories/cold.storage.repository';
import { ColdStorageDTO } from '../dto/cold.storage.dto';
import { ColdStorage } from '../models/cold.storage.model';

@Injectable()
export class ColdStorageService {
  constructor(private readonly coldStorageRepository: ColdStorageRepository) {}

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
}
