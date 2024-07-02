import { Module } from '@nestjs/common';
import { MongoModule } from '../../mongo/mongo.module';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';

@Module({
  imports: [MongoModule],
  controllers: [IngredientController],
  providers: [IngredientService],
})
export class IngredientModule {}
