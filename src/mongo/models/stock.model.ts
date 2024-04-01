import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import DateBeautifier from '../../utils/date.beautifier';

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
    @Prop({ type: String, required: true, unique: true, trim: true })
    name: string;

    @Prop([IngredientItem])
    ingredients: IngredientItem[];

    @Prop({ type: String, required: true, default: DateBeautifier.shared.getFullDate() })
    dateOfCreation: string;

    @Prop({ type: String, required: false })
    dateLastModified?: string;
}

export const StockSchema = SchemaFactory.createForClass(Stock);

StockSchema.pre('updateOne', function(next) {
    this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
    next();
});

StockSchema.pre('findOneAndUpdate', function(next) {
    this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
    next();
});