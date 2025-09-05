import { IsNotEmpty, IsString, MaxLength, IsOptional, IsNumber, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidationMessages } from 'src/common/utils/validation.messages';
import { CoolingCorrectiveActionType } from '../enums/cooling.status.enum';

export class CoolingDTO {
  @IsString({ message: ValidationMessages.STRING })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  @MaxLength(100, { message: ValidationMessages.MAX_LENGTH(100) })
  name: string;

  @IsNumber({}, { message: ValidationMessages.NUMBER })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  initialTemperature: number;

  @IsOptional()
  @IsNumber({}, { message: ValidationMessages.NUMBER })
  finalTemperature?: number;

  @IsDate({ message: ValidationMessages.DATE })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  @Type(() => Date)
  initialDate: Date;

  @IsOptional()
  @IsDate({ message: ValidationMessages.DATE })
  @Type(() => Date)
  finalDate?: Date;

  @IsOptional()
  @IsEnum(CoolingCorrectiveActionType, { message: ValidationMessages.ENUM })
  correctiveAction?: CoolingCorrectiveActionType;
}
