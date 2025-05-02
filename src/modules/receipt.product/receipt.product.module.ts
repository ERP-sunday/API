import { Module } from '@nestjs/common';
import { MongoModule } from 'src/common/modules/mongo.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import {ReceiptProductController} from "./controllers/receipt.product.controller";
import {ReceiptProductService} from "./services/receipt.product.service";

@Module({
    imports: [MongoModule, AuthModule],
    controllers: [ReceiptProductController],
    providers: [ReceiptProductService],
    exports: [ReceiptProductService],
})
export class ReceiptProductModule {}