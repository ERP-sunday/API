import {
  Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put
  } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientDTO } from 'src/dto/ingredient.dto';
import { Ingredient } from 'src/mongo/models/ingredient.model';
import { Response } from 'src/utils/response';
import { DataType } from 'src/mongo/repositories/base.repository';
  
  @Controller('ingredients')
  export class IngredientController {
    constructor(private readonly ingredientService: IngredientService) {}

    @Post()
    async createOne(@Body() ingredientData: IngredientDTO): Promise<Response<Ingredient>> {
      const response = await this.ingredientService.createOne(ingredientData)

      return { error: "", data: response }
    }
  
    @Get()
    async findAll(): Promise<Response<Ingredient[]>> {
        const response = await this.ingredientService.findAll()

        return { error: "", data: response }
    }

    @Get(":id")
    async finOne(@Param() params: any): Promise<Response<Ingredient>> {
      const response = await this.ingredientService.findOne(params.id)

      return { error: "", data: response }
    }

    @Put(":id")
    async updateOne(@Param() params: any, @Body() updateData: DataType): Promise<Response<Ingredient>> {
      const response = await this.ingredientService.updateOne(params.id, updateData)

      return { error: "", data: response }
    }

    @Delete(":id")
    async deleteOne(@Param() params: any) {
      await this.ingredientService.deleteOne(params.id)
    }
  }