import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import { Ingredient } from '../models/ingredient.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class IngredientRepository extends BaseRepository<Ingredient> {
  constructor(@InjectModel(Ingredient.name) private model: Model<Ingredient>) {
    super(model);
  }
}