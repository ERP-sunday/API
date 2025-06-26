import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ValidationMessages } from 'src/common/utils/validation.messages';

export class ColdStorageTemperaturePatchDTO {
  @IsString({ message: ValidationMessages.STRING })
  @IsOptional()
  @MaxLength(50, { message: ValidationMessages.MAX_LENGTH(50) })
  coldStorageId?: string;

  @IsDateString({}, { message: ValidationMessages.DATE })
  @IsOptional()
  date?: string;

  @IsNumber({}, { message: ValidationMessages.NUMBER })
  @IsOptional()
  morningTemperature?: number;

  @IsNumber({}, { message: ValidationMessages.NUMBER })
  @IsOptional()
  eveningTemperature?: number;

  @IsString({ message: ValidationMessages.STRING })
  @IsOptional()
  morningTime?: string;

  @IsString({ message: ValidationMessages.STRING })
  @IsOptional()
  eveningTime?: string;
}
