import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Post,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/mongo/models/order.model';
import { DataType } from 'src/mongo/repositories/base.repository';
import { Response } from 'src/utils/response';
import { OrderDTO } from 'src/dto/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOne(@Body() orderData: OrderDTO): Promise<Response<Order>> {
    const response = await this.orderService.createOne(orderData);

    return { error: '', data: response };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Response<Order[]>> {
    const response = await this.orderService.findAll();

    return { error: '', data: response };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async finOne(@Param() params: any): Promise<Response<Order>> {
    const response = await this.orderService.findOne(params.id);

    return { error: '', data: response };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateOne(
    @Param() params: any,
    @Body() updateData: DataType,
  ): Promise<Response<Order>> {
    const response = await this.orderService.updateOne(params.id, updateData);

    return { error: '', data: response };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(@Param() params: any) {
    await this.orderService.deleteOne(params.id);
  }
}
