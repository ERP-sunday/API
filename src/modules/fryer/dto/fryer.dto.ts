import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ValidationMessages } from 'src/common/utils/validation.messages';

export class FryerDTO {
  @IsString({ message: ValidationMessages.STRING })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  @MaxLength(50, { message: ValidationMessages.MAX_LENGTH(50) })
  name: string;
}
