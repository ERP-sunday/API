import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDateString, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { TemperatureRecordDTO } from './temperature.record.dto';
import { ValidationMessages } from 'src/common/utils/validation.messages';

export class ColdStorageTemperaturePatchDTO {
  @IsString({ message: ValidationMessages.STRING })
  @IsOptional()
  @MaxLength(50, { message: ValidationMessages.MAX_LENGTH(50) })
  coldStorageId?: string;

  @IsDateString({}, { message: ValidationMessages.DATE })
  @IsOptional()
  date?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemperatureRecordDTO)
  temperatureRecords?: TemperatureRecordDTO[];
}
