import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Fryer} from '../models/fryer.model';

@Injectable()
export class FryerRepository extends BaseRepository<Fryer> {
  constructor(
    @InjectModel(Fryer.name) private fryerModel: Model<Fryer>,
  ) {
    super(fryerModel);
  }
}
