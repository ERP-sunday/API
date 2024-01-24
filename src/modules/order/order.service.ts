import { BadRequestException, Injectable } from '@nestjs/common';
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
          tips: orderData.tips,
          date: orderData.date,
          creationDate: orderData.creationDate
        }
      )

      return response as Order
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      const response = await this.orderRepository.findAll()

      return response as Order[]
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<Order> {
    try {
      const response = await this.orderRepository.findOneBy({ _id: id })

      return response as Order
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async updateOne(id: string, orderData: DataType): Promise<Order> {
    try {
      const isUpdate = await this.orderRepository.updateOneBy({ _id: id }, orderData)

      if (!isUpdate) {
        throw new BadRequestException();
      }

      const response = await this.findOne(id)

      return response as Order
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async deleteOne(id: string) {
    try {
      await this.orderRepository.deleteOnyBy({ _id: id })
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}