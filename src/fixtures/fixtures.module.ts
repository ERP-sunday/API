import { Module } from '@nestjs/common';
import { MongoModule } from 'src/common/modules/mongo.module';
import { FixturesService } from './fixtures.service';
import config from 'src/configs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(config().mongoUrl), MongoModule],
  providers: [FixturesService],
})
export class FixturesModule {}
