import { Injectable, NotFoundException } from '@nestjs/common';
import { FryerDTO } from '../dto/fryer.dto';
import { Fryer } from '../models/fryer.model';
import { FryerRepository } from '../repositories/fryer.repository';
import { BaseService } from '../../../common/services/base.service';

@Injectable()
export class FryerService extends BaseService {
  constructor(private readonly fryerRepository: FryerRepository) {
    super();
  }

  async getAllFryers(): Promise<Fryer[]> {
    try {
      return await this.fryerRepository.findAll();
    } catch (error) {
      this.handleError(error);
    }
  }

  async getFryerById(fryerId: string): Promise<Fryer> {
    try {
      const fryer = await this.fryerRepository.findOneById(fryerId);
      return this.assertFound(fryer, `Fryer ${fryerId} not found`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async createFryer(parameters: FryerDTO): Promise<Fryer> {
    try {
      const created = await this.fryerRepository.insert({ name: parameters.name });
      return await this.fryerRepository.findOneById(created._id);
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateFryer(fryerId: string, fryerDto: FryerDTO): Promise<Fryer> {
    try {
      const isUpdated = await this.fryerRepository.updateOneBy(
          { _id: fryerId },
          fryerDto,
      );

      this.assertFound(isUpdated, `Fryer ${fryerId} not found`);

      return await this.getFryerById(fryerId);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteFryer(fryerId: string): Promise<void> {
    try {
      const isDeleted = await this.fryerRepository.deleteOneBy({ _id: fryerId });
      this.assertFound(isDeleted, `Fryer ${fryerId} not found`);
    } catch (error) {
      this.handleError(error);
    }
  }
}