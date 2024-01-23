import {
    Controller,
    Get,
  } from '@nestjs/common';
import { StockService } from './stock.service';
  
  @Controller('stocks')
  export class StockController {
    constructor(private readonly stockService: StockService) {}
  
    @Get()
    findAll(): string {
        return "stocks"
    }
  }