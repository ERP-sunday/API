import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import {
  OilTestMethod,
  OilActionToDoType,
  OilCorrectiveActionType,
} from '../models/oil.check.model';
import { ValidationMessages } from 'src/common/utils/validation.messages';

export class OilCheckPatchDTO {
  @IsMongoId({ message: ValidationMessages.MONGO_ID })
  @IsOptional()
  fryerId?: string;

  @IsEnum(OilTestMethod, { message: ValidationMessages.ENUM })
  @IsOptional()
  testMethod?: OilTestMethod;

  @IsDateString({}, { message: ValidationMessages.DATE })
  @IsOptional()
  date?: string;

  @IsEnum(OilActionToDoType, { message: ValidationMessages.ENUM })
  @IsOptional()
  actionToDo?: OilActionToDoType;

  @IsEnum(OilCorrectiveActionType, { message: ValidationMessages.ENUM })
  @IsOptional()
  correctiveAction?: OilCorrectiveActionType;

  @ValidateIf((o) => o.testMethod === OilTestMethod.DIGITAL_TESTER)
  @IsNumber({}, { message: ValidationMessages.NUMBER })
  @Min(0, { message: 'La valeur minimale est 0' })
  @Max(100, { message: 'La valeur maximale est 100' })
  @IsOptional()
  polarPercentage?: number;
}
