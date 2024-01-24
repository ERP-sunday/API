import { BadRequestException, Injectable } from '@nestjs/common';
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
          isAvailable: dishData.isAvailable,
          creationDate: dishData.creationDate
        }
      )

      return response as Dish
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Dish[]> {
    try {
      const response = await this.dishRepository.findAll()

      return response as Dish[]
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<Dish> {
    try {
      const response = await this.dishRepository.findOneBy({ _id: id })

      return response as Dish
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async updateOne(id: string, dishData: DataType): Promise<Dish> {
    try {
      const isUpdate = await this.dishRepository.updateOneBy({ _id: id }, dishData)

      if (!isUpdate) {
        throw new BadRequestException();
      }

      const response = await this.findOne(id)

      return response as Dish
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async deleteOne(id: string) {
    try {
      await this.dishRepository.deleteOnyBy({ _id: id })
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}