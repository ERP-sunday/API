import { IsString } from 'class-validator';

export class IngredientDTO {
  @IsString()
  name: string;
}
