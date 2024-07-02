import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import { Order } from '../models/order.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(@InjectModel(Order.name) private model: Model<Order>) {
    super(model);
  }
}
