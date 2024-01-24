import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
    FINISH = "FINISH"
}

class DishOrder {
    @Prop({ type: Types.ObjectId, ref: 'Dish' , required: true })
    dish: Types.ObjectId;

    @Prop({ required: true, default: false })
    isPaid: boolean;
}

@Schema()
export class Order extends Document {
    @Prop({ type: Types.ObjectId, ref: 'RestaurantTable', required: true })
    tableNumber: Types.ObjectId;

    @Prop({ type: [DishOrder], required: true })
    dishes: DishOrder[];

    @Prop({ required: true })
    status: OrderStatus;

    @Prop({ required: true })
    totalPrice: number;

    @Prop({ required: true, default: 0 })
    tips: number;

    @Prop({ required: true })
    date: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);