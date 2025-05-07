import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ValidationMessages } from 'src/common/utils/validation.messages';

export class LoginDto {
  @IsEmail({}, { message: ValidationMessages.EMAIL })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  email: string;

  @IsString({ message: ValidationMessages.STRING })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  password: string;
}

export class RegisterDto {
  @IsString({ message: ValidationMessages.STRING })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  @MaxLength(50, { message: ValidationMessages.MAX_LENGTH(50) })
  firstname: string;

  @IsString({ message: ValidationMessages.STRING })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  @MaxLength(50, { message: ValidationMessages.MAX_LENGTH(50) })
  lastname: string;

  @IsEmail({}, { message: ValidationMessages.EMAIL })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  email: string;

  @IsString({ message: ValidationMessages.STRING })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;
}

export class RefreshJWTDto {
  @IsString({ message: ValidationMessages.STRING })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  refreshToken: string;
}