import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {Fryer} from "../../fryer/models/fryer.model";
import DateBeautifier from "../../../common/utils/date.beautifier";

export enum TestMethod {
    NONE = 'none',
    STRIP = 'strip',
    TESTER = 'tester',
}

@Schema()
export class OilCheck extends Document {
    @Prop({ type: Types.ObjectId, ref: Fryer.name, required: true })
    fryer: Types.ObjectId;

    @Prop({
        type: String,
        enum: TestMethod,
        required: true,
    })
    testMethod: TestMethod;

    @Prop({ type: Date, required: true, default: () => new Date() })
    date: Date;

    @Prop({ type: Number, required: true, min: 0, max: 100 })
    polarPercentage: number;

    @Prop({
        type: String,
        required: true,
        default: () => DateBeautifier.shared.getFullDate(),
    })
    dateOfCreation: string;

    @Prop({ type: String, required: false })
    dateLastModified?: string;
}

export const OilCheckSchema = SchemaFactory.createForClass(OilCheck);

OilCheckSchema.pre('updateOne', function (next) {
    this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
    next();
});

OilCheckSchema.pre('findOneAndUpdate', function (next) {
    this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
    next();
});