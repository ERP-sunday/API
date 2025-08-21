import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  MaxLength,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { TemperatureRecordDTO } from './temperature.record.dto';
import { ValidationMessages } from 'src/common/utils/validation.messages';

export class ColdStorageTemperatureDTO {
  @IsMongoId({ message: ValidationMessages.MONGO_ID })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  @MaxLength(50, { message: ValidationMessages.MAX_LENGTH(50) })
  coldStorageId: string;

  @IsDateString({}, { message: ValidationMessages.DATE })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  date: string;

  @IsArray({ message: 'Les relevés de température doivent être un tableau' })
  @ArrayNotEmpty({ message: 'Au moins un relevé de température est requis' })
  @ValidateNested({ each: true, message: 'Chaque relevé doit être valide' })
  @Type(() => TemperatureRecordDTO)
  temperatureRecords: TemperatureRecordDTO[];
}
