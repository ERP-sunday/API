import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { DishDTO, DishIngredientDTO } from 'src/dto/creation/dish.dto';
import { Dish } from 'src/mongo/models/dish.model';
import { DataType } from 'src/mongo/repositories/base.repository';
import { DishRepository } from 'src/mongo/repositories/dish.repository';
import { IngredientRepository } from 'src/mongo/repositories/ingredient.repository';

@Injectable()
export class DishService {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly ingredientRepository: IngredientRepository
  ) {}

  async createOne(dishData: DishDTO): Promise<Dish> {
    try {
      for (const ingredient of dishData.ingredients) {
        const isExists = await this.ingredientRepository.findOneById(ingredient.ingredientId);

        if (isExists == null) {
          throw new BadRequestException(`Ingredient with ID ${ingredient.ingredientId} does not exist.`);
        }
      }

      const ingredientsWithObjectId = dishData.ingredients.map((ingredient: DishIngredientDTO) => ({
        ...ingredient,
        ingredientId: new Types.ObjectId(ingredient.ingredientId),
      }));

      const response = await this.dishRepository.insert(
        {
          name: dishData.name,
          ingredients: ingredientsWithObjectId,
          price: dishData.price,
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
      const response = await this.dishRepository.findAll({ populate: ["ingredients.ingredientId"] })

      return response as Dish[]
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async findTop20Ingredients() {
    return await this.dishRepository.findTop20Ingredients();
  }

  async findOne(id: string): Promise<Dish> {
    try {
      const response = await this.dishRepository.findOneBy({ _id: id }, { populate: ["ingredients.ingredientId"] })

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