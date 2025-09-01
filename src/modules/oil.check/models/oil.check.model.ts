import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseTimestampedSchema } from 'src/common/models/base-timestamped.schema';
import { addDateTrackingHooks } from 'src/common/utils/date.beautifier';
import { Fryer } from 'src/modules/fryer/models/fryer.model';

export enum OilTestMethod {
  NO_TEST = 'NO_TEST',
  TEST_STRIP = 'TEST_STRIP',
  DIGITAL_TESTER = 'DIGITAL_TESTER',
}

export enum OilActionToDoType {
  NO_ACTION = 'NO_ACTION',
  REUSED = 'REUSED',
  FILTERED_AND_REUSED = 'FILTERED_AND_REUSED',
  CHANGED = 'CHANGED',
}

export enum OilCorrectiveActionType {
  NO_ACTION = 'NO_ACTION',
  CHANGE_OIL = 'CHANGE_OIL',
}

@Schema()
export class OilCheck extends BaseTimestampedSchema {
  @Prop({ ref: Fryer.name, type: Types.ObjectId, required: true })
  fryer: Types.ObjectId;

  @Prop({ enum: OilTestMethod, required: true })
  testMethod: OilTestMethod;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({ required: true, enum: OilActionToDoType })
  actionToDo: OilActionToDoType;

  @Prop({ required: true, enum: OilCorrectiveActionType })
  correctiveAction: OilCorrectiveActionType;

  @Prop({
    min: 0,
    max: 100,
    validate: {
      validator: function (this: OilCheck, value: number) {
        // Si la méthode de test est DIGITAL_TESTER, le polarPercentage est obligatoire
        if (this.testMethod === OilTestMethod.DIGITAL_TESTER) {
          return (
            value !== null && value !== undefined && value >= 0 && value <= 100
          );
        }
        // Pour les autres méthodes, le polarPercentage peut être null/undefined
        return (
          value === null || value === undefined || (value >= 0 && value <= 100)
        );
      },
      message:
        'Le pourcentage polaire est obligatoire et doit être entre 0 et 100 quand la méthode de test est "testeur numérique"',
    },
  })
  polarPercentage: number;
}

export const OilCheckSchema = SchemaFactory.createForClass(OilCheck);
addDateTrackingHooks(OilCheckSchema);
