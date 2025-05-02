import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './configs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt.auth.guard';
import { ColdStorageModule } from './modules/cold.storage/cold.storage.module';
import { ColdStorageTemperatureModule } from './modules/cold.storage.temperature/cold.storage.temperature.module';
import {FryerModule} from "./modules/fryer/fryer.module";
import {OilCheckModule} from "./modules/oil.check/oil.check.module";
import {SupplierModule} from "./modules/supplier/supplier.module";
import {ReceiptProductModule} from "./modules/receipt.product/receipt.product.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongoUrl'),
      }),
    }),
    UserModule,
    AuthModule,
    ColdStorageModule,
    ColdStorageTemperatureModule,
    FryerModule,
    OilCheckModule,
    SupplierModule,
    ReceiptProductModule
  ],
  providers: [JwtAuthGuard],
})
export class AppModule {}