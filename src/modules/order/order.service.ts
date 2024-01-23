import { Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/mongo/repositories/order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository
  ) {}
}