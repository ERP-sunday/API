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
import { RestaurantTableRepository } from './repositories/restaurant.table.repository';
import { RestaurantTableSchema, RestaurantTable } from './models/restaurant.table.model';
import { UserRepository } from './repositories/user.repository';
import { User, UserSchema } from './models/user.model';

@Module({
  imports: [
    NestMongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    NestMongooseModule.forFeature([{ name: Dish.name, schema: DishSchema }]),
    NestMongooseModule.forFeature([{ name: Ingredient.name, schema: IngredientSchema }]),
    NestMongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    NestMongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
    NestMongooseModule.forFeature([{ name: RestaurantTable.name, schema: RestaurantTableSchema }]),
    NestMongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [
    CardRepository,
    DishRepository,
    IngredientRepository,
    OrderRepository,
    StockRepository,
    RestaurantTableRepository,
    UserRepository
  ],
  exports: [
    CardRepository,
    DishRepository,
    IngredientRepository,
    OrderRepository,
    StockRepository,
    RestaurantTableRepository,
    UserRepository
  ],
})
export class MongoModule {}