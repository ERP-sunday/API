import { Controller, Get, Body, Param, Put, Delete, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { Response } from 'src/utils/response';
import { DataType } from 'src/mongo/repositories/base.repository';
import { StockService } from './stock.service';
import { Stock } from 'src/mongo/models/stock.model';
import { StockDTO } from 'src/dto/stock.dto';

  @Controller('stocks')
  export class StockController {
    constructor(private readonly stockService: StockService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createOne(@Body() stockData: StockDTO): Promise<Response<Stock>> {
      const response = await this.stockService.createOne(stockData)

      return { error: "", data: response }
    }
  
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<Response<Stock[]>> {
        const response = await this.stockService.findAll()

        return { error: "", data: response }
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async finOne(@Param() params: any): Promise<Response<Stock>> {
      const response = await this.stockService.findOne(params.id)

      return { error: "", data: response }
    }

    @Put(":id")
    @HttpCode(HttpStatus.OK)
    async updateOne(@Param() params: any, @Body() updateData: DataType): Promise<Response<Stock>> {
      const response = await this.stockService.updateOne(params.id, updateData)

      return { error: "", data: response }
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteOne(@Param() params: any) {
      await this.stockService.deleteOne(params.id)
    }
  }