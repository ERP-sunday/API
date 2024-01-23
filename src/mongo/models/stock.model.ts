import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class IngredientItem {
    @Prop({ type: Types.ObjectId, ref: 'Ingredient', required: true })
    ingredient: Types.ObjectId;

    @Prop({ required: true })
    currentQuantity: number;

    @Prop({ required: true })
    minimalQuantity: number;

    @Prop()
    dateAddedToStock: string;

    @Prop()
    dateLastModified: string;
}

@Schema()
export class Stock extends Document {
    @Prop([IngredientItem])
    ingredients: IngredientItem[];
}

export const StockSchema = SchemaFactory.createForClass(Stock);