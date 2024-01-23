import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import { Stock } from '../models/stock.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class StockRepository extends BaseRepository<Stock> {
  constructor(@InjectModel(Stock.name) private model: Model<Stock>) {
    super(model);
  }
}