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

@Module({
  imports: [
    NestMongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NestMongooseModule.forFeature([
      { name: ColdStorage.name, schema: ColdStorageSchema },
    ]),
    NestMongooseModule.forFeature([
      { name: ColdStorageTemperature.name, schema: ColdStorageTemperatureSchema },
    ]),
  ],
  providers: [UserRepository, ColdStorageRepository, ColdStorageTemperatureRepository],
  exports: [NestMongooseModule, UserRepository, ColdStorageRepository, ColdStorageTemperatureRepository],
})
export class MongoModule {}
