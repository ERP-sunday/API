import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
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

export class OilCheckDTO {
  @IsMongoId({ message: ValidationMessages.MONGO_ID })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  fryerId: string;

  @IsEnum(OilTestMethod, { message: ValidationMessages.ENUM })
  testMethod: OilTestMethod;

  @IsDateString({}, { message: ValidationMessages.DATE })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  date: string;

  @IsEnum(OilActionToDoType, { message: ValidationMessages.ENUM })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  actionToDo: OilActionToDoType;

  @IsEnum(OilCorrectiveActionType, { message: ValidationMessages.ENUM })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  correctiveAction: OilCorrectiveActionType;

  @ValidateIf((o) => o.testMethod === OilTestMethod.DIGITAL_TESTER)
  @IsNotEmpty({
    message:
      'Le pourcentage polaire est obligatoire quand la méthode de test est "testeur numérique"',
  })
  @IsNumber({}, { message: ValidationMessages.NUMBER })
  @Min(0, { message: 'La valeur minimale est 0' })
  @Max(100, { message: 'La valeur maximale est 100' })
  polarPercentage: number;
}
