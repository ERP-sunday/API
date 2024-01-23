import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
    
}

class DishOrder {
    @Prop({ type: Types.ObjectId, ref: 'Dish' })
    dish: Types.ObjectId;

    @Prop({ default: false })
    isPaid: boolean;
}

@Schema()
export class Order extends Document {
    @Prop({ required: true })
    tableNumber: number;

    @Prop([DishOrder])
    dishes: DishOrder[];

    @Prop()
    status: OrderStatus;

    @Prop({ required: true })
    totalPrice: number;

    @Prop()
    tips: number;

    @Prop()
    date: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);