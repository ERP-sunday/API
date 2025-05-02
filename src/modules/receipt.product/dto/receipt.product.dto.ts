import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
    Max,
} from 'class-validator';
import {ProductType} from "../models/receipt.product.model";

export class ReceiptProductDTO {
    @ApiProperty({ description: 'Nom du produit' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Type du produit', enum: ProductType })
    @IsEnum(ProductType)
    type: ProductType;

    @ApiProperty({ description: 'Température relevée du produit' })
    @IsNumber()
    @Min(-30)
    @Max(100)
    temperature: number;

    @ApiProperty({ description: 'Numéro de lot du produit' })
    @IsString()
    @IsNotEmpty()
    lotNumber: string;
}