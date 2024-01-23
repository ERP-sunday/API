import { BadRequestException, Injectable } from '@nestjs/common';
import { IngredientDTO } from 'src/dto/ingredient.dto';
import { Ingredient } from 'src/mongo/models/ingredient.model';
import { DataType } from 'src/mongo/repositories/base.repository';
import { IngredientRepository } from 'src/mongo/repositories/ingredient.repository';

@Injectable()
export class IngredientService {
  constructor(
    private readonly ingredientRepository: IngredientRepository
  ) {}

  async createOne(ingredientData: IngredientDTO): Promise<Ingredient> {
    try {
      const response = await this.ingredientRepository.insert({
        name: ingredientData.name,
        allergenes: ingredientData.allergenes,
        image: ingredientData.image,
        category: ingredientData.category
      })

      return response as Ingredient
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Ingredient[]> {
    try {
      const response = await this.ingredientRepository.findAll()

      return response as Ingredient[]
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<Ingredient> {
    try {
      const response = await this.ingredientRepository.findOneBy({ _id: id })

      return response as Ingredient
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async updateOne(id: string, ingredientData: DataType): Promise<Ingredient> {
    try {
      const isUpdate = await this.ingredientRepository.updateOneBy({ _id: id }, ingredientData)

      if (!isUpdate) {
        throw new BadRequestException();
      }

      const response = await this.findOne(id)

      return response as Ingredient
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async deleteOne(id: string) {
    try {
      await this.ingredientRepository.deleteOnyBy({ _id: id })
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}