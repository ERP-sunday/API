import { IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import { ValidationMessages } from 'src/common/utils/validation.messages';
import { CorrectiveActionType } from '../enums/corrective.action.enum';

export class TemperatureRecordDTO {
  @IsNumber({}, { message: ValidationMessages.NUMBER })
  temperature: number;

  // Le format doit être HH:mm (ex: 14:30). Validation au niveau du service
  @IsString({ message: ValidationMessages.STRING })
  time: string;

  @IsOptional()
  @IsEnum(CorrectiveActionType)
  correctiveAction?: CorrectiveActionType;
}