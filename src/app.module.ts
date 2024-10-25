import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from './configs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [MongooseModule.forRoot(config().mongoUrl), UserModule, AuthModule],
  providers: [AuthGuard],
})
export class AppModule {}