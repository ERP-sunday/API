import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { addDateTrackingHooks } from 'src/common/utils/date.beautifier';
import { ColdStorageType } from 'src/common/utils/types/cold.storage.type';
import { BaseTimestampedSchema } from '../../../common/models/base-timestamped.schema';

@Schema()
export class ColdStorage extends BaseTimestampedSchema {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ enum: ColdStorageType, required: true })
  type: ColdStorageType;
}

export const ColdStorageSchema = SchemaFactory.createForClass(ColdStorage);
addDateTrackingHooks(ColdStorageSchema);
