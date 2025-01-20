import { Module } from '@nestjs/common';
import { ColdStorageController } from './controllers/cold.storage.controller';
import { ColdStorageService } from './services/cold.storage.service';
import { MongoModule } from 'src/common/modules/mongo.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [MongoModule, AuthModule],
  controllers: [ColdStorageController],
  providers: [ColdStorageService],
  exports: [ColdStorageService],
})
export class ColdStorageModule {}
