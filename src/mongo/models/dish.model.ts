import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum DishCategory {
    MEAT = "MEAT"
}

class DishIngredient {
    @Prop([{ type: Types.ObjectId, ref: 'Ingredient', required: true }])
    ingredientId: string

    @Prop({ type: Number, required: true })
    quantity: number
}

@Schema()
export class Dish extends Document {
    @Prop({ type: String, required: true, unique: true, trim: true })
    name: string;

    @Prop({ type: [DishIngredient], required: true })
    ingredients: DishIngredient[]

    @Prop({ type: Number, required: true })
    price: number

    @Prop({ type: String, required: true })
    image: string

    @Prop({ type: String, trim: true, required: true })
    description: string

    @Prop({ required: true, enum: DishCategory })
    category: DishCategory;

    @Prop({ type: Number })
    timeCook: number;

    @Prop({ type: Boolean, required: true })
    isAvailable: boolean;

    @Prop({ type: String, required: true })
    creationDate: string
}

export const DishSchema = SchemaFactory.createForClass(Dish);