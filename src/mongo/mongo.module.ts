import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './models/card.model';
import { Dish, DishSchema } from './models/dish.model';
import { Ingredient, IngredientSchema } from './models/ingredient.model';
import { Order, OrderSchema } from './models/order.model';
import { Stock, StockSchema } from './models/stock.model';
import { RestaurantTable, RestaurantTableSchema } from './models/restaurant.table.model';
import { User, UserSchema } from './models/user.model';
import { CardRepository } from './repositories/card.repository';
import { DishRepository } from './repositories/dish.repository';
import { IngredientRepository } from './repositories/ingredient.repository';
import { OrderRepository } from './repositories/order.repository';
import { StockRepository } from './repositories/stock.repository';
import { RestaurantTableRepository } from './repositories/restaurant.table.repository';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    NestMongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: Dish.name, schema: DishSchema },
      { name: Ingredient.name, schema: IngredientSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Stock.name, schema: StockSchema },
      { name: RestaurantTable.name, schema: RestaurantTableSchema },
      { name: User.name, schema: UserSchema }
    ]),
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
    NestMongooseModule,
    CardRepository,
    DishRepository,
    IngredientRepository,
    OrderRepository,
    StockRepository,
    RestaurantTableRepository,
    UserRepository
  ],
})
export class MongoModule { }