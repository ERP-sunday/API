import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { addDateTrackingHooks } from 'src/common/utils/date.beautifier';
import { BaseTimestampedSchema } from '../../../common/models/base-timestamped.schema';

@Schema()
export class Fryer extends BaseTimestampedSchema {
  @Prop({ required: true, unique: true, trim: true })
  name: string;
}

export const FryerSchema = SchemaFactory.createForClass(Fryer);
addDateTrackingHooks(FryerSchema);
