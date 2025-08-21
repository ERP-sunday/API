import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TemperatureStatusQueryDTO {
  @ApiProperty({
    description: 'Date de début au format YYYY-MM-DD',
    example: '2025-07-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La date de début doit être au format YYYY-MM-DD',
  })
  startDate?: string;

  @ApiProperty({
    description: 'Date de fin au format YYYY-MM-DD',
    example: '2025-07-31',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La date de fin doit être au format YYYY-MM-DD',
  })
  endDate?: string;
}
