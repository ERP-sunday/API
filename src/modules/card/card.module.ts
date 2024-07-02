import { Module } from '@nestjs/common';
import { MongoModule } from '../../mongo/mongo.module';
import { CardService } from './card.service';
import { CardController } from './card.controller';

@Module({
  imports: [MongoModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
