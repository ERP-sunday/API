import { Injectable } from '@nestjs/common';
import { CardRepository } from 'src/mongo/repositories/card.repository';

@Injectable()
export class CardService {
  constructor(
    private readonly cardRepository: CardRepository
  ) {}
}