import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import DateBeautifier from 'src/common/utils/date.beautifier';
import { ColdStorageType } from 'src/common/utils/types/cold.storage.type';

@Schema()
export class ColdStorage extends Document {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ enum: ColdStorageType, required: true })
  type: ColdStorageType;

  @Prop({
    type: String,
    required: true,
    default: DateBeautifier.shared.getFullDate(),
  })
  dateOfCreation: string;

  @Prop({ type: String, required: false })
  dateLastModified?: string;
}

export const ColdStorageSchema = SchemaFactory.createForClass(ColdStorage);

ColdStorageSchema.pre('updateOne', function (next) {
  this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
  next();
});

ColdStorageSchema.pre('findOneAndUpdate', function (next) {
  this.set({ dateLastModified: DateBeautifier.shared.getFullDate() });
  next();
});
