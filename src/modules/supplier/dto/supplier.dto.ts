import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SupplierDTO {
    @ApiProperty({ description: 'Nom du fournisseur' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ description: 'Adresse du fournisseur' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional({ description: 'Email du fournisseur' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ description: 'Numéro de téléphone du fournisseur' })
    @IsString()
    @IsOptional()
    phoneNumber?: string;
}