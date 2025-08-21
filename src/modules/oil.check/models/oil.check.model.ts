import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseTimestampedSchema } from 'src/common/models/base-timestamped.schema';
import { addDateTrackingHooks } from 'src/common/utils/date.beautifier';
import { Fryer } from 'src/modules/fryer/models/fryer.model';

export enum TestMethod {
  NONE = 'none',
  STRIP = 'strip',
  TESTER = 'tester',
}

@Schema()
export class OilCheck extends BaseTimestampedSchema {
  @Prop({ ref: Fryer.name, type: Types.ObjectId, required: true })
  fryer: Types.ObjectId;

  @Prop({ enum: TestMethod, required: true })
  testMethod: TestMethod;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({ required: true, min: 0, max: 100 })
  polarPercentage: number;
}

export const OilCheckSchema = SchemaFactory.createForClass(OilCheck);
addDateTrackingHooks(OilCheckSchema);
