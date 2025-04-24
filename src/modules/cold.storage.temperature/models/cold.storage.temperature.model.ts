import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Types, Document} from 'mongoose';
import DateBeautifier from 'src/common/utils/date.beautifier';

@Schema()
export class ColdStorageTemperature extends Document {

  @Prop({ type: Types.ObjectId, ref: 'ColdStorage', required: true })
  coldStorageId: Types.ObjectId;

  @Prop({ type: Date, required: true, default: () => new Date() })
  date: Date;

  @Prop({ type: Number, default: () => null })
  morningTemperature?: number;

  @Prop({ type: Number, default: () => null })
  eveningTemperature?: number;

  @Prop({
    type: String,
    required: true,
    default: DateBeautifier.shared.getFullDate(),
  })
  dateOfCreation: string;

  @Prop({ type: String, required: false })
  dateLastModified?: string;
}

export const ColdStorageTemperatureSchema = SchemaFactory.createForClass(ColdStorageTemperature);

ColdStorageTemperatureSchema.pre('updateOne', function (next) {
  this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
  next();
});

ColdStorageTemperatureSchema.pre('findOneAndUpdate', function (next) {
  this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
  next();
});
