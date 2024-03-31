import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';
import { IngredientUnity } from "src/mongo/models/ingredient.model";

export class IngredientDTO {
    @IsString()
    name: string;
}