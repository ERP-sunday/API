import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import DateBeautifier from "../../../common/utils/date.beautifier";

@Schema()
export class Supplier extends Document {
    @Prop({ type: String, required: true, trim: true })
    name: string;

    @Prop({ type: String, required: false })
    address?: string;

    @Prop({ type: String, required: false, lowercase: true, trim: true })
    email?: string;

    @Prop({ type: String, required: false })
    phoneNumber?: string;

    @Prop({
        type: String,
        required: true,
        default: DateBeautifier.shared.getFullDate(),
    })
    dateOfCreation: string;

    @Prop({ type: String, required: false })
    dateLastModified?: string;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);

SupplierSchema.pre('updateOne', function (next) {
    this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
    next();
});

SupplierSchema.pre('findOneAndUpdate', function (next) {
    this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
    next();
});