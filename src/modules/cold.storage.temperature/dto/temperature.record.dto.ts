import { IsNumber, IsString, Matches } from 'class-validator';
import { ValidationMessages } from 'src/common/utils/validation.messages';

export class TemperatureRecordDTO {
  @IsNumber({}, { message: ValidationMessages.NUMBER })
  temperature: number;

  // Le format doit être HH:mm (ex: 14:30). Validation au niveau du service
  @IsString({ message: ValidationMessages.STRING })
  time: string;
}