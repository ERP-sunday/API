import { Module } from '@nestjs/common';
import { MongoModule } from 'src/common/modules/mongo.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import {OilCheckController} from "./controllers/oil.check.controller";
import {OilCheckService} from "./services/oil.check.service";

@Module({
    imports: [MongoModule, AuthModule],
    controllers: [OilCheckController],
    providers: [OilCheckService],
    exports: [OilCheckService],
})
export class OilCheckModule {}