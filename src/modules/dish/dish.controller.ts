import { Controller, Get, Body, Param, Put, Delete, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { DishService } from './dish.service';
import { Response } from 'src/utils/response';
import { Dish } from 'src/mongo/models/dish.model';
import { DataType } from 'src/mongo/repositories/base.repository';
import { DishDTO } from 'src/dto/creation/dish.dto';
import { DishResponseDTO } from 'src/dto/response/dish.response.dto';
import { MiddlewareBuilder } from '@nestjs/core';

@Controller('dishes')

export class DishController {
  constructor(private readonly dishService: DishService) { }

  @Get("/top-ingredients")
  @HttpCode(HttpStatus.OK)
  async getTop20Ingredients(): Promise<Response<Dish[]>> {
    const response = await this.dishService.findTop20Ingredients()

    return { error: "", data: response }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOne(@Body() dishData: DishDTO): Promise<Response<DishResponseDTO>> {
    const response = await this.dishService.createOne(dishData)

    return { error: "", data: this.toResponseDto(response) }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Response<DishResponseDTO[]>> {
    const response = await this.dishService.findAll()

    return { error: "", data: response.map((dish) => this.toResponseDto(dish)) }
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param() params: any): Promise<Response<DishResponseDTO>> {
    const response = await this.dishService.findOne(params.id)

    return { error: "", data: this.toResponseDto(response) }
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async updateOne(@Param() params: any, @Body() updateData: DataType): Promise<Response<DishResponseDTO>> {
    const response = await this.dishService.updateOne(params.id, updateData)

    return { error: "", data: this.toResponseDto(response) }
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(@Param() params: any) {
    await this.dishService.deleteOne(params.id)
  }

  private toResponseDto(dish: Dish): DishResponseDTO {
    return {
      _id: dish._id,
      name: dish.name,
      ingredients: dish.ingredients.map(ingredient => {
        const ingredientData = ingredient.ingredientId as any;

        return {
          ingredientRef: {
            _id: ingredientData._id,
            name: ingredientData.name
          },
          unity: ingredient.unity,
          quantity: ingredient.quantity
        }
      }),
      price: dish.price,
      description: dish.description,
      category: dish.category,
      timeCook: dish.timeCook,
      isAvailable: dish.isAvailable
    };
  }
}