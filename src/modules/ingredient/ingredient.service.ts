import { Injectable } from '@nestjs/common';
import { IngredientRepository } from 'src/mongo/repositories/ingredient.repository';

@Injectable()
export class IngredientService {
  constructor(
    private readonly ingredientRepository: IngredientRepository
  ) {}
}