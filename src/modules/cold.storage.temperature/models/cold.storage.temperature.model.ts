import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { addDateTrackingHooks } from 'src/common/utils/date.beautifier';
import { BaseTimestampedSchema } from '../../../common/models/base-timestamped.schema';
import { TemperatureRecord } from './temperature.record.model';


@Schema()
export class ColdStorageTemperature extends BaseTimestampedSchema {
  @Prop({ ref: 'ColdStorage', type: Types.ObjectId, required: true })
  coldStorageId: Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({ type: [TemperatureRecord], default: [] })
  temperatureRecords: TemperatureRecord[];
}

export const ColdStorageTemperatureSchema = SchemaFactory.createForClass(
  ColdStorageTemperature,
);

// Ajout des index pour optimiser les requêtes fréquentes
ColdStorageTemperatureSchema.index({ coldStorageId: 1, date: -1 });
ColdStorageTemperatureSchema.index({ date: -1 });

addDateTrackingHooks(ColdStorageTemperatureSchema);
