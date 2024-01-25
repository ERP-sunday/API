import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
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
          isActive: cardData.isActive
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

  async addDish(cardId: string, newDishId: string): Promise<Card> {
    try {
      const card = await this.findOne(cardId);
  
      if (!card) {
        throw new NotFoundException(`Card with ID ${cardId} not found`);
      }
  
      const objectIdNewDishId = new Types.ObjectId(newDishId);

      if (card.dishesId.map(id => id.toString()).includes(objectIdNewDishId.toString())) {
        throw new Error(`Dish with ID ${newDishId} is already in the card`);
      }
  
      const isUpdated = await this.cardRepository.pushArray(
        { _id: cardId },
        { dishesId: objectIdNewDishId }
      );
  
      if (!isUpdated) {
        throw new Error('Unable to add dish to the card');
      }
  
      return await this.findOne(cardId);
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
  
  async removeDish(cardId: string, dishIdToRemove: string): Promise<Card> {
    try {
      const objectIdDishIdToRemove = new Types.ObjectId(dishIdToRemove);
  
      const isUpdated = await this.cardRepository.pullArray(
        { _id: cardId },
        { dishesId: objectIdDishIdToRemove }
      );
  
      if (!isUpdated) {
        throw new Error('Unable to remove dish from the card');
      }
  
      return await this.findOne(cardId);
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