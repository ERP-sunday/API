import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Card extends Document {
    @Prop({ required: true, unique: true, trim: true })
    name: string;

    @Prop([{ type: Types.ObjectId, ref: 'Dish', required: true }])
    dishesId: Types.ObjectId[];

    @Prop({ required: true })
    isActive: boolean;

    @Prop()
    creationDate: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);