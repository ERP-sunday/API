import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import DateBeautifier from '../../utils/date.beautifier';

export enum OrderStatus {
  FINISH = 'FINISH',
}

class DishOrder {
  @Prop({ type: Types.ObjectId, ref: 'Dish', required: true })
  dishId: Types.ObjectId;

  @Prop({ type: Boolean, required: true, default: false })
  isPaid: boolean;
}

@Schema()
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'RestaurantTable', required: true })
  tableNumberId: Types.ObjectId;

  @Prop({ type: [DishOrder], required: true })
  dishes: DishOrder[];

  @Prop({ enum: OrderStatus, required: true })
  status: OrderStatus;

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: Number, required: true, default: 0 })
  tips: number;

  @Prop({
    type: String,
    required: true,
    default: DateBeautifier.shared.getFullDate(),
  })
  dateOfCreation: string;

  @Prop({ type: String, required: false })
  dateLastModified?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre('updateOne', function (next) {
  this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
  next();
});

OrderSchema.pre('findOneAndUpdate', function (next) {
  this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
  next();
});
