import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
    FINISH = "FINISH"
}

class DishOrder {
    @Prop({ type: Types.ObjectId, ref: 'Dish' , required: true })
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

    @Prop({ type: String, required: true })
    date: string;

    @Prop({ type: String, required: true })
    creationDate: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);