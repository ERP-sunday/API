import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from './configs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt.auth.guard';
import { ColdStorageModule } from './modules/cold.storage/cold.storage.module';

@Module({
  imports: [
    MongooseModule.forRoot(config().mongoUrl),
    UserModule,
    AuthModule,
    ColdStorageModule,
  ],
  providers: [JwtAuthGuard],
})
export class AppModule {}
