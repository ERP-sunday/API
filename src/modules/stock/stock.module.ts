import { Module } from '@nestjs/common';
import { MongoModule } from '../../mongo/mongo.module';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [MongoModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}