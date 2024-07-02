import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientDTO } from 'src/dto/creation/ingredient.dto';
import { Ingredient } from 'src/mongo/models/ingredient.model';
import { Response } from 'src/utils/response';
import { DataType } from 'src/mongo/repositories/base.repository';
import { FirebaseTokenGuard } from 'src/guards/firebase-token.guard';

@Controller('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  @UseGuards(FirebaseTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  async createOne(
    @Body() ingredientData: IngredientDTO,
  ): Promise<Response<Ingredient>> {
    const response = await this.ingredientService.createOne(ingredientData);

    return { error: '', data: response };
  }

  @Get('/search')
  @UseGuards(FirebaseTokenGuard)
  async searchIngredients(
    @Query('name') name: string,
  ): Promise<Response<Ingredient[]>> {
    const response = await this.ingredientService.findByName(name);

    return { error: '', data: response };
  }

  @Get()
  @UseGuards(FirebaseTokenGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Response<Ingredient[]>> {
    const response = await this.ingredientService.findAll();

    return { error: '', data: response };
  }

  @Get(':id')
  @UseGuards(FirebaseTokenGuard)
  @HttpCode(HttpStatus.OK)
  async finOne(@Param() params: any): Promise<Response<Ingredient>> {
    const response = await this.ingredientService.findOne(params.id);

    return { error: '', data: response };
  }

  @Put(':id')
  @UseGuards(FirebaseTokenGuard)
  @HttpCode(HttpStatus.OK)
  async updateOne(
    @Param() params: any,
    @Body() updateData: DataType,
  ): Promise<Response<Ingredient>> {
    const response = await this.ingredientService.updateOne(
      params.id,
      updateData,
    );

    return { error: '', data: response };
  }

  @Delete(':id')
  @UseGuards(FirebaseTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(@Param() params: any) {
    await this.ingredientService.deleteOne(params.id);
  }
}
