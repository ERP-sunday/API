import {
    IsEnum,
    IsMongoId,
    IsOptional,
    IsNumber,
    Min,
    Max,
    IsDateString,
} from 'class-validator';
import { TestMethod } from '../models/oil.check.model';
import { ValidationMessages } from 'src/common/utils/validation.messages';

export class OilCheckPatchDTO {
    @IsMongoId({ message: ValidationMessages.MONGO_ID })
    @IsOptional()
    fryerId?: string;

    @IsEnum(TestMethod, { message: ValidationMessages.ENUM })
    @IsOptional()
    testMethod?: TestMethod;

    @IsDateString({}, { message: ValidationMessages.DATE })
    @IsOptional()
    date?: string;

    @IsNumber({}, { message: ValidationMessages.NUMBER })
    @Min(0, { message: 'La valeur minimale est 0' })
    @Max(100, { message: 'La valeur maximale est 100' })
    @IsOptional()
    polarPercentage?: number;
}
