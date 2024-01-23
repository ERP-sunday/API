import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './models/card.model';
import { Dish, DishSchema } from './models/dish.model'; 
import { Ingredient, IngredientSchema } from './models/ingredient.model';
import { Order, OrderSchema } from './models/order.model';
import { Stock, StockSchema } from './models/stock.model';
import { CardRepository } from './repositories/card.repository';
import { DishRepository } from './repositories/dish.repository';
import { IngredientRepository } from './repositories/ingredient.repository';
import { OrderRepository } from './repositories/order.repository';
import { StockRepository } from './repositories/stock.repository';

@Module({
  imports: [
    NestMongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    NestMongooseModule.forFeature([{ name: Dish.name, schema: DishSchema }]),
    NestMongooseModule.forFeature([{ name: Ingredient.name, schema: IngredientSchema }]),
    NestMongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    NestMongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }])
  ],
  providers: [
    CardRepository,
    DishRepository,
    IngredientRepository,
    OrderRepository,
    StockRepository
  ],
  exports: [
    CardRepository,
    DishRepository,
    IngredientRepository,
    OrderRepository,
    StockRepository
  ],
})
export class MongoModule {}