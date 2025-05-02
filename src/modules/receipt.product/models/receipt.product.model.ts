import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ProductType {
    MEAT = 'meat',
    FISH = 'fish',
    VEGETABLE = 'vegetable',
    DAIRY = 'dairy',
    OTHER = 'other',
}

export class ReceiptProduct extends Document {
    @Prop({ type: String, required: true, trim: true })
    name: string;

    @Prop({ type: String, enum: ProductType, required: true })
    type: ProductType;

    @Prop({ type: Number, required: true })
    temperature: number;

    @Prop({ type: String, required: true })
    lotNumber: string;
}

export const ReceiptProductSchema = SchemaFactory.createForClass(ReceiptProduct);
