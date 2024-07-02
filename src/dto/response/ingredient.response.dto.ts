import { IsString } from 'class-validator';

export class IngredientResponseDTO {
  @IsString()
  _id: string;

  @IsString()
  name: string;
}
