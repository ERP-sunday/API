import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './models/card.model';
import { Dish, DishSchema } from './models/dish.model'; 
import { Ingredient, IngredientSchema } from './models/ingredient.model';
import { Order, OrderSchema } from './models/order.model';
import { Stock, StockSchema } from './models/stock.model';

@Module({
  imports: [
    NestMongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    NestMongooseModule.forFeature([{ name: Dish.name, schema: DishSchema }]),
    NestMongooseModule.forFeature([{ name: Ingredient.name, schema: IngredientSchema }]),
    NestMongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    NestMongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }])
  ],
  providers: [],
  exports: [],
})
export class MongoModule {}