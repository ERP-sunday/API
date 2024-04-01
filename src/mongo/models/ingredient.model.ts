import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import DateBeautifier from '../../utils/date.beautifier';

export enum IngredientUnity {
    VEGETABLE = "VEGETABLE"
}

@Schema()
export class Ingredient extends Document {
    @Prop({ type: String, required: true, unique: true, trim: true })
    name: string;

    @Prop({ type: String, required: true, default: DateBeautifier.shared.getFullDate() })
    dateOfCreation: string;

    @Prop({ type: String, required: false })
    dateLastModified?: string;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);

IngredientSchema.pre('updateOne', function(next) {
    this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
    next();
});

IngredientSchema.pre('findOneAndUpdate', function(next) {
    this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
    next();
});