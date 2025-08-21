import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ColdStorageType } from 'src/common/utils/types/cold.storage.type';
import { ValidationMessages } from '../../../common/utils/validation.messages';

export class ColdStoragePatchDTO {
  @IsString({ message: ValidationMessages.STRING })
  @IsOptional()
  @MaxLength(50, { message: ValidationMessages.MAX_LENGTH(50) })
  name?: string;

  @IsEnum(ColdStorageType, { message: ValidationMessages.ENUM })
  @IsOptional()
  type?: ColdStorageType;
}
