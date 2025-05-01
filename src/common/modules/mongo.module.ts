import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/user/models/user.model';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { ColdStorageRepository } from 'src/modules/cold.storage/repositories/cold.storage.repository';
import { ColdStorage, ColdStorageSchema } from "../../modules/cold.storage/models/cold.storage.model";
import {
  ColdStorageTemperatureRepository
} from "src/modules/cold.storage.temperature/repositories/cold.storage.temperature.repository";
import {
  ColdStorageTemperature,
  ColdStorageTemperatureSchema
} from "src/modules/cold.storage.temperature/models/cold.storage.temperature.model";
import {Fryer, FryerSchema} from "../../modules/fryer/models/fryer.model";
import {FryerRepository} from "../../modules/fryer/repositories/fryer.repository";
import {OilCheckRepository} from "../../modules/oil.check/repositories/oil.check.repository";
import {OilCheck, OilCheckSchema} from "../../modules/oil.check/models/oil.check.model";

@Module({
  imports: [
    NestMongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NestMongooseModule.forFeature([
      { name: ColdStorage.name, schema: ColdStorageSchema },
    ]),
    NestMongooseModule.forFeature([
      { name: ColdStorageTemperature.name, schema: ColdStorageTemperatureSchema },
    ]),
    NestMongooseModule.forFeature([
      { name: Fryer.name, schema: FryerSchema },
    ]),
    NestMongooseModule.forFeature([
      { name: OilCheck.name, schema: OilCheckSchema },
    ]),
  ],
  providers: [UserRepository, ColdStorageRepository, ColdStorageTemperatureRepository, FryerRepository, OilCheckRepository],
  exports: [NestMongooseModule, UserRepository, ColdStorageRepository, ColdStorageTemperatureRepository, FryerRepository, OilCheckRepository],
})
export class MongoModule {}
