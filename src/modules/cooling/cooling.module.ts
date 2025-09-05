import { Module } from '@nestjs/common';
import { MongoModule } from 'src/common/modules/mongo.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CoolingController } from './controllers/cooling.controller';
import { CoolingService } from './services/cooling.service';

@Module({
  imports: [MongoModule, AuthModule],
  controllers: [CoolingController],
  providers: [CoolingService],
  exports: [CoolingService],
})
export class CoolingModule {}