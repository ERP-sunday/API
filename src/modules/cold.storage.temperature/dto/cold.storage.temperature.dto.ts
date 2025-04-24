import {IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ColdStorageTemperatureDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  coldStorageId: string

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date: Date

  @ApiProperty({ required: false })
  @IsNumber({}, { each: true })
  @IsOptional()
  morningTemperature?: number

  @ApiProperty({ required: false })
  @IsNumber({}, { each: true })
  @IsOptional()
  eveningTemperature?: number
}