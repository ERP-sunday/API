import { DishCategory, DishIngredientUnity } from "src/mongo/models/dish.model";
import { IsString, IsNumber, IsBoolean, IsOptional, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";

export class DishDTO {
    @IsString()
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DishIngredientDTO)
    ingredients: DishIngredientDTO[];

    @IsNumber()
    price: number;

    @IsString()
    description: string;

    @IsString()
    category: DishCategory;

    @IsOptional()
    @IsNumber()
    timeCook?: number;

    @IsBoolean()
    isAvailable: boolean;
}

export class DishIngredientDTO {
    @IsString()
    ingredientId: string;

    @IsString()
    unity: DishIngredientUnity

    @IsNumber()
    quantity: number;
}
