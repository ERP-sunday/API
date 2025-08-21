import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ValidationMessages } from 'src/common/utils/validation.messages';

export class LoginDTO {
  @IsEmail({}, { message: ValidationMessages.EMAIL })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  email: string;

  @IsString({ message: ValidationMessages.STRING })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  password: string;
}
