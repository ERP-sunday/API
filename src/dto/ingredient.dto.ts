import { IsString, IsArray, IsOptional } from 'class-validator';
import { IngredientCategory } from "src/mongo/models/ingredient.model";

export class IngredientDTO {
    @IsString()
    name: string;

    @IsArray()
    allergenes: string[];

    @IsOptional()
    @IsString()
    image?: string;

    @IsString()
    category: IngredientCategory;
}