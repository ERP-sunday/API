import {
    Controller,
    Get,
  } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
  
  @Controller('ingredients')
  export class IngredientController {
    constructor(private readonly ingredientService: IngredientService) {}
  
    @Get()
    findAll(): string {
        return "ingredients"
    }
  }