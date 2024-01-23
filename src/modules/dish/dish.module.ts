import { Module } from '@nestjs/common';
import { MongoModule } from '../../mongo/mongo.module';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';

@Module({
  imports: [MongoModule],
  controllers: [DishController],
  providers: [DishService],
})
export class DishModule {}