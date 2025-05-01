import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Supplier} from "../models/supplier.model";

@Injectable()
export class SupplierRepository extends BaseRepository<Supplier> {
    constructor(
        @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
    ) {
        super(supplierModel);
    }
}
