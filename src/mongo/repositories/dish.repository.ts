import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import { Dish } from '../models/dish.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DishRepository extends BaseRepository<Dish> {
  constructor(@InjectModel(Dish.name) private model: Model<Dish>) {
    super(model);
  }
}