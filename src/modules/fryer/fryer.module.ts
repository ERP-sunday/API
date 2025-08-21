import { Module } from '@nestjs/common';
import { FryerController } from './controllers/fryer.controller';
import { FryerService } from './services/fryer.service';
import { MongoModule } from 'src/common/modules/mongo.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [MongoModule, AuthModule],
  controllers: [FryerController],
  providers: [FryerService],
  exports: [FryerService],
})
export class FryerModule {}
