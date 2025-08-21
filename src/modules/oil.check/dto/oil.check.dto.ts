import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { TestMethod } from '../models/oil.check.model';
import { ValidationMessages } from 'src/common/utils/validation.messages';

export class OilCheckDTO {
  @IsMongoId({ message: ValidationMessages.MONGO_ID })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  fryerId: string;

  @IsEnum(TestMethod, { message: ValidationMessages.ENUM })
  testMethod: TestMethod;

  @IsDateString({}, { message: ValidationMessages.DATE })
  @IsNotEmpty({ message: ValidationMessages.REQUIRED })
  date: string;

  @IsNumber({}, { message: ValidationMessages.NUMBER })
  @Min(0, { message: 'La valeur minimale est 0' })
  @Max(100, { message: 'La valeur maximale est 100' })
  polarPercentage: number;
}
