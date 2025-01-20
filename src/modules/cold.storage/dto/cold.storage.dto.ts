import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ColdStorageType } from 'src/common/utils/types/cold.storage.type';

export class ColdStorageDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum(ColdStorageType, { message: 'Invalid type for ColdStorage' })
  type: ColdStorageType;
}
