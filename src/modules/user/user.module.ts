import { Module } from '@nestjs/common';
import { MongoModule } from 'src/common/modules/mongo.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [MongoModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
