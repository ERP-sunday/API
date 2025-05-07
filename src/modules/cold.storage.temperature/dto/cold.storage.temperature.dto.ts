import {IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength} from 'class-validator';
import { ValidationMessages } from 'src/common/utils/validation.messages';

export class ColdStorageTemperatureDTO {
  @IsMongoId({ message: ValidationMessages.MONGO_ID })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  @MaxLength(50, { message: ValidationMessages.MAX_LENGTH(50) })
  coldStorageId: string;

  @IsDateString({}, { message: ValidationMessages.DATE })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  date: string;

  @IsNumber({}, { message: ValidationMessages.NUMBER })
  @IsOptional()
  morningTemperature?: number;

  @IsNumber({}, { message: ValidationMessages.NUMBER })
  @IsOptional()
  eveningTemperature?: number;
}
