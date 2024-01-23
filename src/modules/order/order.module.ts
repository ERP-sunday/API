import { Module } from '@nestjs/common';
import { MongoModule } from '../../mongo/mongo.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [MongoModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}