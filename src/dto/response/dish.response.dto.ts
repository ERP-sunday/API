import { DishCategory, DishIngredientUnity } from 'src/mongo/models/dish.model';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IngredientResponseDTO } from './ingredient.response.dto';

export class DishResponseDTO {
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DishIngredientResponseDTO)
  ingredients: DishIngredientResponseDTO[];

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

export class DishIngredientResponseDTO {
  ingredientRef: IngredientResponseDTO;

  @IsString()
  unity: DishIngredientUnity;

  @IsNumber()
  quantity: number;
}
