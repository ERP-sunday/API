import { BadRequestException, Injectable } from '@nestjs/common';
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
          ingredients: stockData.ingredients
        }
      )

      return response as Stock
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Stock[]> {
    try {
      const response = await this.stockRepository.findAll()

      return response as Stock[]
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<Stock> {
    try {
      const response = await this.stockRepository.findOneBy({ _id: id })

      return response as Stock
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async updateOne(id: string, stockData: DataType): Promise<Stock> {
    try {
      const isUpdate = await this.stockRepository.updateOneBy({ _id: id }, stockData)

      if (!isUpdate) {
        throw new BadRequestException();
      }

      const response = await this.findOne(id)

      return response as Stock
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async deleteOne(id: string) {
    try {
      await this.stockRepository.deleteOnyBy({ _id: id })
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}