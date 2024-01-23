import {
    Controller,
    Get,
  } from '@nestjs/common';
import { CardService } from './card.service';
  
  @Controller('cards')
  export class CardController {
    constructor(private readonly cardService: CardService) {}
  
    @Get()
    findAll(): string {
        return "cards"
    }
  }