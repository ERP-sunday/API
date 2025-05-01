import { ApiProperty } from '@nestjs/swagger';
import {IsEnum, IsMongoId, IsNotEmpty, IsNumber, Min, Max, IsDateString} from 'class-validator';
import {TestMethod} from "../models/oil.check.model";

export class OilCheckDTO {
    @ApiProperty({ description: 'ID du Fryer associé' })
    @IsMongoId()
    @IsNotEmpty()
    fryerId: string;

    @ApiProperty({
        description: 'Méthode de test utilisée',
        enum: TestMethod,
    })
    @IsEnum(TestMethod, { message: 'Méthode de test invalide' })
    testMethod: TestMethod;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    date: Date

    @ApiProperty({
        description: 'Pourcentage polaire mesuré',
        example: 12.5,
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    polarPercentage: number;
}
