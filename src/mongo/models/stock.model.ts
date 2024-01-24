import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class IngredientItem {
    @Prop({ type: Types.ObjectId, ref: 'Ingredient', required: true })
    ingredientId: Types.ObjectId;

    @Prop({ required: true , default: 0})
    currentQuantity: number;

    @Prop({ required: true, default: 0 })
    minimalQuantity: number;

    @Prop({ required: true })
    dateAddedToStock: string;

    @Prop({ required: false })
    dateLastModified?: string;
}

@Schema()
export class Stock extends Document {
    @Prop([IngredientItem])
    ingredients: IngredientItem[];
}

export const StockSchema = SchemaFactory.createForClass(Stock);