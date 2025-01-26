import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/user/models/user.model';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { ColdStorageRepository } from 'src/modules/cold.storage/repositories/cold.storage.repository';
import { ColdStorage, ColdStorageSchema } from "../../modules/cold.storage/models/cold.storage.model";

@Module({
  imports: [
    NestMongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NestMongooseModule.forFeature([
      { name: ColdStorage.name, schema: ColdStorageSchema },
    ]),
  ],
  providers: [UserRepository, ColdStorageRepository],
  exports: [NestMongooseModule, UserRepository, ColdStorageRepository],
})
export class MongoModule {}
