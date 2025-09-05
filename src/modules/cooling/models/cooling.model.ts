import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { addDateTrackingHooks } from 'src/common/utils/date.beautifier';
import { BaseTimestampedSchema } from '../../../common/models/base-timestamped.schema';
import { CoolingStatus, CoolingCorrectiveActionType } from '../enums/cooling.status.enum';

@Schema()
export class Cooling extends BaseTimestampedSchema {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  initialTemperature: number;

  @Prop({ required: false })
  finalTemperature?: number;

  @Prop({ required: true, default: () => new Date() }) // Stocké en UTC par Mongoose
  initialDate: Date;

  @Prop({ required: false }) // Stocké en UTC par Mongoose
  finalDate?: Date;

  @Prop({ required: true, enum: CoolingStatus, default: CoolingStatus.NOT_STARTED })
  status: CoolingStatus;

  @Prop({ required: true, enum: CoolingCorrectiveActionType, default: CoolingCorrectiveActionType.NO_ACTION })
  correctiveAction: CoolingCorrectiveActionType;
}

export const CoolingSchema = SchemaFactory.createForClass(Cooling);
addDateTrackingHooks(CoolingSchema);
