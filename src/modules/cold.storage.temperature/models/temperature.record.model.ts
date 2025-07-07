import { Prop, Schema } from "@nestjs/mongoose";
import { TemperatureAnomalyType } from "../enums/temperature.anomaly.enum";
import { TemperatureCorrectiveActionType } from "../enums/temperature.corrective.action.enum";

@Schema()
export class TemperatureRecord {
  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true, enum: TemperatureAnomalyType })
  anomaly?: TemperatureAnomalyType;

  @Prop({ required: false, enum: TemperatureCorrectiveActionType })
  correctiveAction?: TemperatureCorrectiveActionType;
}
