import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Post,
  Patch,
  HttpStatus,
  HttpCode,
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
  @HttpCode(HttpStatus.CREATED)
  async createOne(@Body() cardData: CardDTO): Promise<Response<Card>> {
    const response = await this.cardService.createOne(cardData);

    return { error: '', data: response };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Response<Card[]>> {
    const response = await this.cardService.findAll();

    return { error: '', data: response };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async finOne(@Param() params: any): Promise<Response<Card>> {
    const response = await this.cardService.findOne(params.id);

    return { error: '', data: response };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateOne(
    @Param() params: any,
    @Body() updateData: DataType,
  ): Promise<Response<Card>> {
    const response = await this.cardService.updateOne(params.id, updateData);

    return { error: '', data: response };
  }

  @Patch(':id/dishes/:dishId')
  @HttpCode(HttpStatus.OK)
  async addDish(@Param() params: any): Promise<Response<Card>> {
    const response = await this.cardService.addDish(params.id, params.dishId);

    return { error: '', data: response };
  }

  @Delete(':id/dishes/:dishId')
  @HttpCode(HttpStatus.OK)
  async removeDish(@Param() params: any): Promise<Response<Card>> {
    const response = await this.cardService.removeDish(
      params.id,
      params.dishId,
    );

    return { error: '', data: response };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(@Param() params: any) {
    await this.cardService.deleteOne(params.id);
  }
}
