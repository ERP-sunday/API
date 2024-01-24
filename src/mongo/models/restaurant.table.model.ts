import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RestaurantTable extends Document {
    @Prop({ required: true })
    number: number
}

export const RestaurantTableSchema = SchemaFactory.createForClass(RestaurantTable);