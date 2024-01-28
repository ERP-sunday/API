import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { OrderDTO } from 'src/dto/order.dto';
import { Order } from 'src/mongo/models/order.model';
import { DataType } from 'src/mongo/repositories/base.repository';
import { OrderRepository } from 'src/mongo/repositories/order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository
  ) {}

  async createOne(orderData: OrderDTO): Promise<Order> {
    try {
      const response = await this.orderRepository.insert(
        {
          tableNumberId: orderData.tableNumberId,
          dishes: orderData.dishes,
          status: orderData.status,
          totalPrice: orderData.totalPrice,
          tips: orderData.tips
        }
      )

      return response as Order
    } catch (e) {
      console.log(e);
      if (e.name === 'ValidationError') {
        throw new BadRequestException(e.message);
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      const response = await this.orderRepository.findAll()

      return response as Order[]
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async findOne(id: string): Promise<Order> {
    try {
      const response = await this.orderRepository.findOneBy({ _id: id })

      if (!response) {
        throw new NotFoundException(`Card with ID ${id} not found`);
      }

      return response as Order
    } catch (e) {
      console.log(e);
      if (e.name == "CastError") {
        throw new BadRequestException('Invalid ID format');
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async updateOne(id: string, orderData: DataType): Promise<Order> {
    try {
      const isUpdate = await this.orderRepository.updateOneBy({ _id: id }, orderData)

      if (!isUpdate) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      const response = await this.findOne(id)

      return response as Order
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
      const isDeleted = await this.orderRepository.deleteOnyBy({ _id: id })
      
      if (!isDeleted) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }
}