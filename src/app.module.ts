import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from './configs/config';
import { IngredientModule } from './modules/ingredient/ingredient.module';
import { CardModule } from './modules/card/card.module';
import { DishModule } from './modules/dish/dish.module';
import { OrderModule } from './modules/order/order.module';
import { StockModule } from './modules/stock/stock.module';
import { RestaurantTableModule } from './modules/table/restaurant.table.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot(config().mongoUrl),
    IngredientModule,
    CardModule,
    DishModule,
    OrderModule,
    StockModule,
    RestaurantTableModule,
    UserModule,
    AuthModule
  ],
  providers: [AuthGuard]
})
export class AppModule {}
