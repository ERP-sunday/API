import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RestaurantTable } from '../models/restaurant.table.model';

@Injectable()
export class RestaurantTableRepository extends BaseRepository<RestaurantTable> {
  constructor(
    @InjectModel(RestaurantTable.name) private model: Model<RestaurantTable>,
  ) {
    super(model);
  }
}
