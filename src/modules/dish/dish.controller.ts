import { Controller, Get, Body, Param, Put, Delete, Post } from '@nestjs/common';
import { DishService } from './dish.service';
import { Response } from 'src/utils/response';
import { Dish } from 'src/mongo/models/dish.model';
import { DataType } from 'src/mongo/repositories/base.repository';
import { DishDTO } from 'src/dto/dish.dto';

  @Controller('dishes')
  export class DishController {
    constructor(private readonly dishService: DishService) {}
  
    @Post()
    async createOne(@Body() dishData: DishDTO): Promise<Response<Dish>> {
      const response = await this.dishService.createOne(dishData)

      return { error: "", data: response }
    }
  
    @Get()
    async findAll(): Promise<Response<Dish[]>> {
        const response = await this.dishService.findAll()

        return { error: "", data: response }
    }

    @Get(":id")
    async finOne(@Param() params: any): Promise<Response<Dish>> {
      const response = await this.dishService.findOne(params.id)

      return { error: "", data: response }
    }

    @Put(":id")
    async updateOne(@Param() params: any, @Body() updateData: DataType): Promise<Response<Dish>> {
      const response = await this.dishService.updateOne(params.id, updateData)

      return { error: "", data: response }
    }

    @Delete(":id")
    async deleteOne(@Param() params: any) {
      await this.dishService.deleteOne(params.id)
    }
  }