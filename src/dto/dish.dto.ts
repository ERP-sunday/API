import { DishCategory } from "src/mongo/models/dish.model";
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
    image: string;

    @IsString()
    description: string;

    @IsString()
    category: DishCategory;

    @IsOptional()
    @IsNumber()
    timeCook?: number;

    @IsBoolean()
    isAvailable: boolean;

    @IsOptional()
    @IsString()
    creationDate?: string;
}

export class DishIngredientDTO {
    @IsString()
    ingredientId: string;

    @IsNumber()
    quantity: number;
}
