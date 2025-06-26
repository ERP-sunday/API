import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { addDateTrackingHooks } from 'src/common/utils/date.beautifier';
import { BaseTimestampedSchema } from '../../../common/models/base-timestamped.schema';

@Schema()
export class ColdStorageTemperature extends BaseTimestampedSchema {
  @Prop({ ref: 'ColdStorage', type: Types.ObjectId, required: true })
  coldStorageId: Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop()
  morningTemperature?: number;

  @Prop()
  eveningTemperature?: number;
}

export const ColdStorageTemperatureSchema = SchemaFactory.createForClass(
  ColdStorageTemperature,
);
addDateTrackingHooks(ColdStorageTemperatureSchema);
