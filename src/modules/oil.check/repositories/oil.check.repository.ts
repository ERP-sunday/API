import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OilCheck } from '../models/oil.check.model';

@Injectable()
export class OilCheckRepository extends BaseRepository<OilCheck> {
  constructor(
    @InjectModel(OilCheck.name) private oilCheckModel: Model<OilCheck>,
  ) {
    super(oilCheckModel);
  }
}
