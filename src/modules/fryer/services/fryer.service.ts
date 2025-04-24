import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FryerDTO } from '../dto/fryer.dto';
import { Fryer } from '../models/fryer.model';
import {FryerRepository} from "../repositories/fryer.repository";

@Injectable()
export class FryerService {
  constructor(private readonly fryerRepository: FryerRepository) {}

  async getAllFryers(): Promise<Fryer[]> {
    try {
      return await this.fryerRepository.findAll();
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getFryerById(fryerId: string): Promise<Fryer> {
    try {
      const fryer = await this.fryerRepository.findOneById(fryerId);
      if (!fryer) throw new NotFoundException();
      return fryer;
    } catch {
      throw new NotFoundException();
    }
  }

  async createFryer(parameters: FryerDTO): Promise<Fryer> {
    try {
      const savedFryer = await this.fryerRepository.insert({
        name: parameters.name,
      });
      return await this.fryerRepository.findOneById(savedFryer._id);
    } catch {
      throw new BadRequestException();
    }
  }

  async updateFryer(fryerId: string, fryerDto: FryerDTO): Promise<Fryer> {
    const isUpdated = await this.fryerRepository.updateOneBy(
        { _id: fryerId },
        fryerDto,
    );

    if (!isUpdated) {
      throw new NotFoundException();
    }

    return await this.getFryerById(fryerId);
  }

  async deleteFryer(fryerId: string): Promise<void> {
    const isDeleted = await this.fryerRepository.deleteOneBy({
      _id: fryerId,
    });

    if (!isDeleted) {
      throw new NotFoundException();
    }
  }
}
