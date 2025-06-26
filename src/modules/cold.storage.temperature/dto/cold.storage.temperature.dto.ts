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

  @IsString({ message: ValidationMessages.STRING })
  @IsOptional()
  morningTime?: string;

  @IsString({ message: ValidationMessages.STRING })
  @IsOptional()
  eveningTime?: string;

  validate() {
    if (this.morningTemperature !== undefined && (this.morningTime === undefined || this.morningTime === '')) {
      throw new Error('morningTime est obligatoire si morningTemperature est renseigné');
    }
    if (this.eveningTemperature !== undefined && (this.eveningTime === undefined || this.eveningTime === '')) {
      throw new Error('eveningTime est obligatoire si eveningTemperature est renseigné');
    }
  }
}
