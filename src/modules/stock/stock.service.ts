import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { StockDTO } from 'src/dto/stock.dto';
import { Stock } from 'src/mongo/models/stock.model';
import { DataType } from 'src/mongo/repositories/base.repository';
import { StockRepository } from 'src/mongo/repositories/stock.repository';

@Injectable()
export class StockService {
  constructor(
    private readonly stockRepository: StockRepository
  ) {}

  async createOne(stockData: StockDTO): Promise<Stock> {
    try {
      const response = await this.stockRepository.insert(
        {
          name: stockData.name,
          ingredients: stockData.ingredients
        }
      )

      return response as Stock
    } catch (e) {
      console.log(e);
      if (e.name === 'ValidationError') {
        throw new BadRequestException(e.message);
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll(): Promise<Stock[]> {
    try {
      const response = await this.stockRepository.findAll()

      return response as Stock[]
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async findOne(id: string): Promise<Stock> {
    try {
      const response = await this.stockRepository.findOneBy({ _id: id })

      if (!response) {
        throw new NotFoundException(`Stock with ID ${id} not found`);
      }

      return response as Stock
    } catch (e) {
      console.log(e);
      if (e.name == "CastError") {
        throw new BadRequestException('Invalid ID format');
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async updateOne(id: string, stockData: DataType): Promise<Stock> {
    try {
      const isUpdate = await this.stockRepository.updateOneBy({ _id: id }, stockData)

      if (!isUpdate) {
        throw new NotFoundException(`Stock with ID ${id} not found`);
      }

      const response = await this.findOne(id)

      return response as Stock
    } catch (e) {
      console.log(e);
      if (e.message.includes('Unable to remove dish')) {
        throw new BadRequestException(e.message);
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async deleteOne(id: string) {
    try {
      const isDeleted = await this.stockRepository.deleteOnyBy({ _id: id })

      if (!isDeleted) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }
}