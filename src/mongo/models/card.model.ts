import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import DateBeautifier from '../../utils/date.beautifier';

@Schema()
export class Card extends Document {
    @Prop({ type: String, required: true, unique: true, trim: true })
    name: string;

    @Prop([{ type: Types.ObjectId, ref: 'Dish', required: true, unique: true }])
    dishesId: Types.ObjectId[];

    @Prop({ type: Boolean, required: true, default: false })
    isActive: boolean;

    @Prop({ type: String, required: true, default: DateBeautifier.shared.getFullDate() })
    dateOfCreation: string;

    @Prop({ type: String, required: false })
    dateLastModified?: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);

CardSchema.pre('updateOne', function(next) {
    this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
    next();
});

CardSchema.pre('findOneAndUpdate', function(next) {
    this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
    next();
});