import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class IngredientItem {
    @Prop({ type: Types.ObjectId, ref: 'Ingredient', required: true })
    ingredientId: Types.ObjectId;

    @Prop({ type: Number, required: true , default: 0})
    currentQuantity: number;

    @Prop({ type: Number, required: true, default: 0 })
    minimalQuantity: number;

    @Prop({ type: String, required: true })
    dateAddedToStock: string;

    @Prop({ type: String, required: false })
    dateLastModified?: string;
}

@Schema()
export class Stock extends Document {
    @Prop([IngredientItem])
    ingredients: IngredientItem[];
}

export const StockSchema = SchemaFactory.createForClass(Stock);