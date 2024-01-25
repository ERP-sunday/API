import { Controller, Get, Body, Param, Put, Delete, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { RestaurantTableService } from './restaurant.table.service';
import { RestaurantTable } from 'src/mongo/models/restaurant.table.model';
import { DataType } from 'src/mongo/repositories/base.repository';
import { Response } from 'src/utils/response';
import { RestaurantTableDTO } from 'src/dto/restaurant.table.dto';

  @Controller('tables')
  export class RestaurantTableController {
    constructor(private readonly restaurantTableService: RestaurantTableService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createOne(@Body() restaurantTableData: RestaurantTableDTO): Promise<Response<RestaurantTable>> {
      const response = await this.restaurantTableService.createOne(restaurantTableData)

      return { error: "", data: response }
    }
  
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<Response<RestaurantTable[]>> {
        const response = await this.restaurantTableService.findAll()

        return { error: "", data: response }
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async finOne(@Param() params: any): Promise<Response<RestaurantTable>> {
      const response = await this.restaurantTableService.findOne(params.id)

      return { error: "", data: response }
    }

    @Put(":id")
    @HttpCode(HttpStatus.OK)
    async updateOne(@Param() params: any, @Body() updateData: DataType): Promise<Response<RestaurantTable>> {
      const response = await this.restaurantTableService.updateOne(params.id, updateData)

      return { error: "", data: response }
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteOne(@Param() params: any) {
      await this.restaurantTableService.deleteOne(params.id)
    }
  }