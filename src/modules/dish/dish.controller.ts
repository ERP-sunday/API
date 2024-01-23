import {
    Controller,
    Get,
  } from '@nestjs/common';
import { DishService } from './dish.service';
  
  @Controller('dishes')
  export class DishController {
    constructor(private readonly dishService: DishService) {}
  
    @Get()
    findAll(): string {
        return "dishes"
    }
  }