import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RestaurantTableDTO } from 'src/dto/restaurant.table.dto';
import { RestaurantTable } from 'src/mongo/models/restaurant.table.model';
import { DataType } from 'src/mongo/repositories/base.repository';
import { RestaurantTableRepository } from 'src/mongo/repositories/restaurant.table.repository';

@Injectable()
export class RestaurantTableService {
  constructor(
    private readonly restaurantTableRepository: RestaurantTableRepository
  ) {}

  async createOne(restaurantTableData: RestaurantTableDTO): Promise<RestaurantTable> {
    try {
      const response = await this.restaurantTableRepository.insert(
        {
          number: restaurantTableData.number
        }
      )

      return response as RestaurantTable
    } catch (e) {
      console.log(e);
      if (e.name === 'ValidationError') {
        throw new BadRequestException(e.message);
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll(): Promise<RestaurantTable[]> {
    try {
      const response = await this.restaurantTableRepository.findAll()

      return response as RestaurantTable[]
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async findOne(id: string): Promise<RestaurantTable> {
    try {
      const response = await this.restaurantTableRepository.findOneBy({ _id: id })

      if (!response) {
        throw new NotFoundException(`Table with ID ${id} not found`);
      }

      return response as RestaurantTable
    } catch (e) {
      console.log(e);
      if (e.name == "CastError") {
        throw new BadRequestException('Invalid ID format');
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async updateOne(id: string, restaurantTableData: DataType): Promise<RestaurantTable> {
    try {
      const isUpdate = await this.restaurantTableRepository.updateOneBy({ _id: id }, restaurantTableData)

      if (!isUpdate) {
        throw new NotFoundException(`Table with ID ${id} not found`);
      }

      const response = await this.findOne(id)

      return response as RestaurantTable
    } catch (e) {
      console.log(e);
      if (e.message.includes('Unable to remove dish')) {
        throw new BadRequestException(e.message);
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async deleteOne(id: string) {
    try {
      const isDeleted = await this.restaurantTableRepository.deleteOnyBy({ _id: id })

      if (!isDeleted) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }
}