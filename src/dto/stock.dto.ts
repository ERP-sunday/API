import { IsArray, ValidateNested, IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class StockDTO {
    @IsString()
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IngredientItemDTO)
    ingredients: IngredientItemDTO[];
}

export class IngredientItemDTO {
    @IsString()
    ingredientId: string;

    @IsNumber()
    currentQuantity: number;

    @IsNumber()
    minimalQuantity: number;

    @IsString()
    dateAddedToStock: string;

    @IsOptional()
    @IsString()
    dateLastModified?: string;
}