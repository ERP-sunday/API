import { Injectable } from '@nestjs/common';
import { DishRepository } from 'src/mongo/repositories/dish.repository';

@Injectable()
export class DishService {
  constructor(
    private readonly dishRepository: DishRepository
  ) {}
}