import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum DishCategory {

}

@Schema()
export class Dish extends Document {
    @Prop({ required: true, unique: true, trim: true })
    name: string;

    @Prop([{ type: Types.ObjectId, ref: 'Ingredient', required: true }])
    ingredients: Types.ObjectId[];

    @Prop({ required: true })
    price: number

    @Prop({ required: true })
    image: string

    @Prop({ trim: true, required: true })
    description: string

    @Prop({ required: true, enum: DishCategory })
    category: DishCategory;

    @Prop()
    timeCook: number;

    @Prop({ required: true })
    isAvailable: boolean;
}

export const DishSchema = SchemaFactory.createForClass(Dish);