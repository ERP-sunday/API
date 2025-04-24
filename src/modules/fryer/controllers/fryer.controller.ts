import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FryerService } from '../services/fryer.service';
import { FryerDTO } from 'src/modules/fryer/dto/fryer.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { Fryer } from '../models/fryer.model';

@ApiTags('fryer')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'fryer',
  version: '1',
})
export class FryerController {
  constructor(private readonly fryerService: FryerService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/')
  @ApiOperation({ summary: 'Get all fryers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all fryers',
    type: [Fryer],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  async findAll() {
    const fryers = await this.fryerService.getAllFryers();
    return { error: null, data: fryers };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @ApiOperation({ summary: 'Get a fryer by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fryer details',
    type: Fryer,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Fryer not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  async findOne(@Param('id') id: string) {
    const fryer = await this.fryerService.getFryerById(id);
    return { error: null, data: fryer };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/')
  @ApiOperation({ summary: 'Create fryer' })
  @ApiBody({ type: FryerDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fryer created successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async create(@Body() fryerDto: FryerDTO) {
    const newFryer = await this.fryerService.createFryer(fryerDto);
    return { error: null, data: newFryer };
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  @ApiOperation({ summary: 'Update a fryer' })
  @ApiBody({ type: FryerDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fryer updated successfully',
    type: Fryer,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  async update(@Param('id') id: string, @Body() fryerDto: FryerDTO) {
    const updatedFryer = await this.fryerService.updateFryer(id, fryerDto);
    return { error: null, data: updatedFryer };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a fryer' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fryer deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Fryer not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  async delete(@Param('id') id: string) {
    await this.fryerService.deleteFryer(id);
    return { error: null, data: null };
  }
}
