import { Module } from '@nestjs/common';
import { MongoModule } from '../../common/modules/mongo.module';
import { AuthModule } from '../auth/auth.module';
import { ColdStorageTemperatureController } from './controllers/cold.storage.temperature.controller';
import { ColdStorageTemperatureService } from './services/cold.storage.temperature.service';

@Module({
  imports: [MongoModule, AuthModule],
  controllers: [ColdStorageTemperatureController],
  providers: [ColdStorageTemperatureService],
  exports: [ColdStorageTemperatureService],
})
export class ColdStorageTemperatureModule {}
