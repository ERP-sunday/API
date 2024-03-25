import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IngredientDTO } from 'src/dto/creation/ingredient.dto';
import { Ingredient } from 'src/mongo/models/ingredient.model';
import { DataType } from 'src/mongo/repositories/base.repository';
import { IngredientRepository } from 'src/mongo/repositories/ingredient.repository';

@Injectable()
export class IngredientService {
  constructor(
    private readonly ingredientRepository: IngredientRepository
  ) {}

  async findByName(searchTerm: string): Promise<Ingredient[]> {
    const regex = new RegExp(searchTerm, 'i'); // 'i' pour une recherche insensible à la casse
    return this.ingredientRepository.findManyBy({ name: { $regex: regex } });
  }

  async createOne(ingredientData: IngredientDTO): Promise<Ingredient> {
    try {
      const response = await this.ingredientRepository.insert({
        name: ingredientData.name
      })

      return response as Ingredient
    } catch (e) {
      console.log(e);
      if (e.name === 'ValidationError') {
        throw new BadRequestException(e.message);
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll(): Promise<Ingredient[]> {
    try {
      const response = await this.ingredientRepository.findAll()

      return response as Ingredient[]
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async findOne(id: string): Promise<Ingredient> {
    try {
      const response = await this.ingredientRepository.findOneBy({ _id: id })

      if (!response) {
        throw new NotFoundException(`Card with ID ${id} not found`);
      }

      return response as Ingredient
    } catch (e) {
      console.log(e);
      if (e.name == "CastError") {
        throw new BadRequestException('Invalid ID format');
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async updateOne(id: string, ingredientData: DataType): Promise<Ingredient> {
    try {
      const isUpdate = await this.ingredientRepository.updateOneBy({ _id: id }, ingredientData)

      if (!isUpdate) {
        throw new NotFoundException(`Ingredient with ID ${id} not found`);
      }

      const response = await this.findOne(id)

      return response as Ingredient
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
      const isDeleted = await this.ingredientRepository.deleteOnyBy({ _id: id })

      if (!isDeleted) {
        throw new NotFoundException(`Dish with ID ${id} not found`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }
}