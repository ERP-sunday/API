import { BadRequestException, Injectable } from '@nestjs/common';
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
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<RestaurantTable[]> {
    try {
      const response = await this.restaurantTableRepository.findAll()

      return response as RestaurantTable[]
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<RestaurantTable> {
    try {
      const response = await this.restaurantTableRepository.findOneBy({ _id: id })

      return response as RestaurantTable
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async updateOne(id: string, restaurantTableData: DataType): Promise<RestaurantTable> {
    try {
      const isUpdate = await this.restaurantTableRepository.updateOneBy({ _id: id }, restaurantTableData)

      if (!isUpdate) {
        throw new BadRequestException();
      }

      const response = await this.findOne(id)

      return response as RestaurantTable
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async deleteOne(id: string) {
    try {
      await this.restaurantTableRepository.deleteOnyBy({ _id: id })
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}