import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import { Card } from '../models/card.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CardRepository extends BaseRepository<Card> {
  constructor(@InjectModel(Card.name) private model: Model<Card>) {
    super(model);
  }
}