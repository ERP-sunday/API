import { Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/mongo/repositories/order.repository';
import { StockRepository } from 'src/mongo/repositories/stock.repository';

@Injectable()
export class StockService {
  constructor(
    private readonly stockRepository: StockRepository
  ) {}
}