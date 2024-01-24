import { Controller, Get, Body, Param, Put, Delete, Post } from '@nestjs/common';
import { RestaurantTableService } from './restaurant.table.service';
import { RestaurantTable } from 'src/mongo/models/restaurant.table.model';
import { DataType } from 'src/mongo/repositories/base.repository';
import { Response } from 'src/utils/response';
import { RestaurantTableDTO } from 'src/dto/restaurant.table.dto';

  @Controller('tables')
  export class RestaurantTableController {
    constructor(private readonly restaurantTableService: RestaurantTableService) {}
  
    @Post()
    async createOne(@Body() restaurantTableData: RestaurantTableDTO): Promise<Response<RestaurantTable>> {
      const response = await this.restaurantTableService.createOne(restaurantTableData)

      return { error: "", data: response }
    }
  
    @Get()
    async findAll(): Promise<Response<RestaurantTable[]>> {
        const response = await this.restaurantTableService.findAll()

        return { error: "", data: response }
    }

    @Get(":id")
    async finOne(@Param() params: any): Promise<Response<RestaurantTable>> {
      const response = await this.restaurantTableService.findOne(params.id)

      return { error: "", data: response }
    }

    @Put(":id")
    async updateOne(@Param() params: any, @Body() updateData: DataType): Promise<Response<RestaurantTable>> {
      const response = await this.restaurantTableService.updateOne(params.id, updateData)

      return { error: "", data: response }
    }

    @Delete(":id")
    async deleteOne(@Param() params: any) {
      await this.restaurantTableService.deleteOne(params.id)
    }
  }