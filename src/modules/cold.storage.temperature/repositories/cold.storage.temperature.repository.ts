import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {ColdStorageTemperature} from "../models/cold.storage.temperature.model";

@Injectable()
export class ColdStorageTemperatureRepository extends BaseRepository<ColdStorageTemperature> {
  constructor(
    @InjectModel(ColdStorageTemperature.name) private coldStorageTemperatureModel: Model<ColdStorageTemperature>,
  ) {
    super(coldStorageTemperatureModel);
  }
}
