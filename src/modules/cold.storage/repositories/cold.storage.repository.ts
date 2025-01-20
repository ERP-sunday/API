import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ColdStorage } from '../models/cold.storage.model';

@Injectable()
export class ColdStorageRepository extends BaseRepository<ColdStorage> {
  constructor(
    @InjectModel(ColdStorage.name) private coldStorageModel: Model<ColdStorage>,
  ) {
    super(coldStorageModel);
  }
}
