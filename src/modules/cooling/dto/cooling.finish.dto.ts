import { IsOptional, IsString, MaxLength, IsNumber, IsEnum, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidationMessages } from 'src/common/utils/validation.messages';
import { CoolingCorrectiveActionType } from '../enums/cooling.status.enum';

export class CoolingFinishDTO {
  @IsOptional()
  @IsString({ message: ValidationMessages.STRING })
  @MaxLength(100, { message: ValidationMessages.MAX_LENGTH(100) })
  name?: string;

  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  @IsNumber({}, { message: ValidationMessages.NUMBER })
  finalTemperature: number;

  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  @IsDate({ message: ValidationMessages.DATE })
  @Type(() => Date)
  finalDate: Date;

  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  @IsEnum(CoolingCorrectiveActionType, { message: ValidationMessages.ENUM })
  correctiveAction: CoolingCorrectiveActionType;
}