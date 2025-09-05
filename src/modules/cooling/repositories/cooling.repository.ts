import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cooling } from '../models/cooling.model';

@Injectable()
export class CoolingRepository extends BaseRepository<Cooling> {
  constructor(@InjectModel(Cooling.name) private coolingModel: Model<Cooling>) {
    super(coolingModel);
  }
}