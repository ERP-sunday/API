import {
  Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put
  } from '@nestjs/common';
import { CardService } from './card.service';
import { Card } from 'src/mongo/models/card.model';
import { CardDTO } from 'src/dto/card.dto';
import { Response } from 'src/utils/response';
import { DataType } from 'src/mongo/repositories/base.repository';
  
  @Controller('cards')
  export class CardController {
    constructor(private readonly cardService: CardService) {}
  
    @Post()
    async createOne(@Body() ingredientData: CardDTO): Promise<Response<Card>> {
      const response = await this.cardService.createOne(ingredientData)

      return { error: "", data: response }
    }
  
    @Get()
    async findAll(): Promise<Response<Card[]>> {
        const response = await this.cardService.findAll()

        return { error: "", data: response }
    }

    @Get(":id")
    async finOne(@Param() params: any): Promise<Response<Card>> {
      const response = await this.cardService.findOne(params.id)

      return { error: "", data: response }
    }

    @Put(":id")
    async updateOne(@Param() params: any, @Body() updateData: DataType): Promise<Response<Card>> {
      const response = await this.cardService.updateOne(params.id, updateData)

      return { error: "", data: response }
    }

    @Delete(":id")
    async deleteOne(@Param() params: any) {
      await this.cardService.deleteOne(params.id)
    }
  }