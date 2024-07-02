import { Module } from '@nestjs/common';
import { MongoModule } from '../mongo/mongo.module';
import { FixturesService } from './fixtures.service';
import config from '../configs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(config().mongoUrl), MongoModule],
  providers: [FixturesService],
})
export class FixturesModule {}
