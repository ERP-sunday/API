import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {ReceiptProduct} from "../models/receipt.product.model";

@Injectable()
export class ReceiptProductRepository extends BaseRepository<ReceiptProduct> {
    constructor(
        @InjectModel(ReceiptProduct.name) private receiptProductModel: Model<ReceiptProduct>,
    ) {
        super(receiptProductModel);
    }
}
