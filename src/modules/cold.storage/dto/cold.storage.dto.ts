import {IsEnum, IsNotEmpty, IsString, MaxLength} from 'class-validator';
import { ColdStorageType } from 'src/common/utils/types/cold.storage.type';
import {ValidationMessages} from "../../../common/utils/validation.messages";

export class ColdStorageDTO {
  @IsString({ message: ValidationMessages.STRING })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  @MaxLength(50, { message: ValidationMessages.MAX_LENGTH(50) })
  name: string;

  @IsEnum(ColdStorageType, { message: ValidationMessages.ENUM })
  type: ColdStorageType;
}
