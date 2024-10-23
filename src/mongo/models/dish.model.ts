import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import DateBeautifier from '../../utils/date.beautifier';

export enum DishCategory {
  MEAT = 'MEAT'
}

export enum DishIngredientUnity {
  MILLILITRE = 'MILLILITRE',
  CENTILITRE = 'CENTILITRE',
}

@Schema()
class DishIngredient {
  @Prop({ type: Types.ObjectId, ref: 'Ingredient', required: true })
  ingredientId: Types.ObjectId;

  @Prop({ required: true })
  unity: DishIngredientUnity;

  @Prop({ type: Number, required: true })
  quantity: number;
}

@Schema()
export class Dish extends Document {
  @Prop({ type: String, required: true, unique: true, trim: true })
  name: string;

  @Prop({ type: [DishIngredient], required: true })
  ingredients: DishIngredient[];

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, trim: true, required: true })
  description: string;

  @Prop({ required: true, enum: DishCategory })
  category: DishCategory;

  @Prop({ type: Number })
  timeCook: number;

  @Prop({ type: Boolean, required: true })
  isAvailable: boolean;

  @Prop({
    type: String,
    required: true,
    default: DateBeautifier.shared.getFullDate(),
  })
  dateOfCreation: string;

  @Prop({ type: String, required: false })
  dateLastModified?: string;
}

export const DishSchema = SchemaFactory.createForClass(Dish);

DishSchema.pre('updateOne', function (next) {
  this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
  next();
});

DishSchema.pre('findOneAndUpdate', function (next) {
  this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
  next();
});
