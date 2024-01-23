import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum IngredientCategory {
    VEGETABLE = "VEGETABLE"
}

@Schema()
export class Ingredient extends Document {
    @Prop({ required: true, unique: true, trim: true })
    name: string;

    @Prop({ type: [String], trim: true })
    allergenes: string[]

    @Prop({ required: false })
    image: string

    @Prop({ required: true, enum: IngredientCategory })
    category: IngredientCategory;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);