import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { BaseTimestampedSchema } from 'src/common/models/base-timestamped.schema';
import { addDateTrackingHooks } from 'src/common/utils/date.beautifier';

@Schema()
export class User extends BaseTimestampedSchema {
  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: true, trim: true })
  firstname: string;

  @Prop({ required: true, trim: true })
  lastname: string;

  @Prop()
  @Exclude()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
addDateTrackingHooks(UserSchema);
