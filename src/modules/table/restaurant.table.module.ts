import { Module } from '@nestjs/common';
import { MongoModule } from '../../mongo/mongo.module';
import { RestaurantTableController } from './restaurant.table.controller';
import { RestaurantTableService } from './restaurant.table.service';

@Module({
  imports: [MongoModule],
  controllers: [RestaurantTableController],
  providers: [RestaurantTableService],
})
export class RestaurantTableModule {}
