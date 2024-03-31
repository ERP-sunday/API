import { Controller, Get, Body, Param, Put, Delete, Post, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam, ApiSecurity } from '@nestjs/swagger';
import { DishService } from './dish.service';
import { Response } from 'src/utils/response';
import { Dish } from 'src/mongo/models/dish.model';
import { DishDTO } from 'src/dto/creation/dish.dto';
import { DishResponseDTO } from 'src/dto/response/dish.response.dto';
import { FirebaseTokenGuard } from 'src/guards/firebase-token.guard';
import { DataType } from 'src/mongo/repositories/base.repository';

@ApiTags('Dishes')
@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) { }

  @Get("/top-ingredients")
  @UseGuards(FirebaseTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get top 20 ingredients used in dishes' })
  @ApiResponse({ status: 200, type: Dish, isArray: true })
  @ApiSecurity('Bearer')
  async getTop20Ingredients(): Promise<Response<Dish[]>> {
    const response = await this.dishService.findTop20Ingredients()

    return { error: "", data: response }
  }

  @Post()
  @UseGuards(FirebaseTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new dish' })
  @ApiResponse({ status: 201, description: 'The dish has been successfully created.', type: DishResponseDTO })
  @ApiBody({ type: DishDTO })
  @ApiSecurity('Bearer')
  async createOne(@Body() dishData: DishDTO): Promise<Response<DishResponseDTO>> {
    const response = await this.dishService.createOne(dishData)

    return { error: "", data: this.toResponseDto(response) }
  }

  @Get()
  @UseGuards(FirebaseTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all dishes' })
  @ApiResponse({ status: 200, description: 'List of all dishes', type: DishResponseDTO, isArray: true })
  @ApiSecurity('Bearer')
  async findAll(): Promise<Response<DishResponseDTO[]>> {
    const response = await this.dishService.findAll()

    return { error: "", data: response.map((dish) => this.toResponseDto(dish)) }
  }

  @Get(":id")
  @UseGuards(FirebaseTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find one dish by ID' })
  @ApiResponse({ status: 200, description: 'The dish found by ID', type: DishResponseDTO })
  @ApiParam({ name: 'id', description: 'The ID of the dish to find' })
  @ApiSecurity('Bearer')
  async findOne(@Param() params: any): Promise<Response<DishResponseDTO>> {
    const response = await this.dishService.findOne(params.id)

    return { error: "", data: this.toResponseDto(response) }
  }

  @Put(":id")
  @UseGuards(FirebaseTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a dish by ID' })
  @ApiResponse({ status: 200, description: 'The dish has been successfully updated.', type: DishResponseDTO })
  @ApiParam({ name: 'id', description: 'The ID of the dish to update' })
  @ApiBody({ type: DishDTO })
  @ApiSecurity('Bearer')
  async updateOne(@Param() params: any, @Body() updateData: DataType): Promise<Response<DishResponseDTO>> {
    const response = await this.dishService.updateOne(params.id, updateData)

    return { error: "", data: this.toResponseDto(response) }
  }

  @Delete(":id")
  @UseGuards(FirebaseTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a dish by ID' })
  @ApiResponse({ status: 204, description: 'The dish has been successfully deleted.' })
  @ApiParam({ name: 'id', description: 'The ID of the dish to delete' })
  @ApiSecurity('Bearer')
  async deleteOne(@Param() params: any) {
    await this.dishService.deleteOne(params.id)
  }

  private toResponseDto(dish: Dish): DishResponseDTO {
    return {
      _id: dish._id,
      name: dish.name,
      ingredients: dish.ingredients.map(ingredient => {
        const ingredientData = ingredient.ingredientId as any;

        return {
          ingredientRef: {
            _id: ingredientData._id,
            name: ingredientData.name
          },
          unity: ingredient.unity,
          quantity: ingredient.quantity
        }
      }),
      price: dish.price,
      description: dish.description,
      category: dish.category,
      timeCook: dish.timeCook,
      isAvailable: dish.isAvailable
    };
  }
}