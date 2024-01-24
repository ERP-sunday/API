import { BadRequestException, Injectable } from '@nestjs/common';
import { CardDTO } from 'src/dto/card.dto';
import { Card } from 'src/mongo/models/card.model';
import { DataType } from 'src/mongo/repositories/base.repository';
import { CardRepository } from 'src/mongo/repositories/card.repository';

@Injectable()
export class CardService {
  constructor(
    private readonly cardRepository: CardRepository
  ) {}

  async createOne(cardData: CardDTO): Promise<Card> {
    try {
      const response = await this.cardRepository.insert(
        {
          name: cardData.name,
          dishesId: cardData.dishesId,
          isActive: cardData.isActive,
          creationDate: cardData.creationDate
        }
      )

      return response as Card
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Card[]> {
    try {
      const response = await this.cardRepository.findAll()

      return response as Card[]
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<Card> {
    try {
      const response = await this.cardRepository.findOneBy({ _id: id })

      return response as Card
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async updateOne(id: string, cardData: DataType): Promise<Card> {
    try {
      const isUpdate = await this.cardRepository.updateOneBy({ _id: id }, cardData)

      if (!isUpdate) {
        throw new BadRequestException();
      }

      const response = await this.findOne(id)

      return response as Card
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async deleteOne(id: string) {
    try {
      await this.cardRepository.deleteOnyBy({ _id: id })
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}