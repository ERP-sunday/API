import { IsString, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DishDTO } from './creation/dish.dto';

export class CardDTO {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DishDTO)
  dishesId: DishDTO[];

  @IsBoolean()
  isActive: boolean;
}
