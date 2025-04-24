import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FryerDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
