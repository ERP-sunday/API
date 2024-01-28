import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DishDTO } from 'src/dto/dish.dto';
import { Dish } from 'src/mongo/models/dish.model';
import { DataType } from 'src/mongo/repositories/base.repository';
import { DishRepository } from 'src/mongo/repositories/dish.repository';

@Injectable()
export class DishService {
  constructor(
    private readonly dishRepository: DishRepository
  ) {}

  async createOne(dishData: DishDTO): Promise<Dish> {
    try {
      const response = await this.dishRepository.insert(
        {
          name: dishData.name,
          ingredients: dishData.ingredients,
          price: dishData.price,
          image: dishData.image,
          description: dishData.description,
          category: dishData.category,
          timeCook: dishData.timeCook,
          isAvailable: dishData.isAvailable
        }
      )

      return response as Dish
    } catch (e) {
      console.log(e);
      if (e.name === 'ValidationError') {
        throw new BadRequestException(e.message);
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll(): Promise<Dish[]> {
    try {
      const response = await this.dishRepository.findAll()

      return response as Dish[]
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async findOne(id: string): Promise<Dish> {
    try {
      const response = await this.dishRepository.findOneBy({ _id: id })

      if (!response) {
        throw new NotFoundException(`Card with ID ${id} not found`);
      }

      return response as Dish
    } catch (e) {
      console.log(e);
      if (e.name == "CastError") {
        throw new BadRequestException('Invalid ID format');
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async updateOne(id: string, dishData: DataType): Promise<Dish> {
    try {
      const isUpdate = await this.dishRepository.updateOneBy({ _id: id }, dishData)

      if (!isUpdate) {
        throw new NotFoundException(`Dish with ID ${id} not found`);
      }

      const response = await this.findOne(id)

      return response as Dish
    } catch (e) {
      console.log(e);
      if (e.message == "CastError") {
        throw new BadRequestException('Invalid ID format');
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async deleteOne(id: string) {
    try {
      const isDeleted = await this.dishRepository.deleteOnyBy({ _id: id })

      if (!isDeleted) {
        throw new NotFoundException(`Dish with ID ${id} not found`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }
}