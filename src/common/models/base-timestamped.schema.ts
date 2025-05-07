import { Prop } from '@nestjs/mongoose';
import DateBeautifier from 'src/common/utils/date.beautifier';
import { Document } from "mongoose";

export abstract class BaseTimestampedSchema extends Document {
    @Prop({
        type: String,
        required: true,
        default: () => DateBeautifier.getFullDate(),
    })
    dateOfCreation: string;

    @Prop({ type: String, required: false })
    dateLastModified?: string;
}