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
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {ColdStorageTemperatureService} from '../services/cold.storage.temperature.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import {ColdStorageDTO} from "../../cold.storage/dto/cold.storage.dto";
import {ColdStorageTemperatureDTO} from "../dto/cold.storage.temperature.dto";
import {ColdStorageTemperature} from "../models/cold.storage.temperature.model";
import {ColdStorageTemperaturePatchDTO} from "../dto/cold.storage.temperature.patch.dto";

@ApiTags('cold-storage-temperature')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'cold-storage-temperature',
  version: '1',
})
export class ColdStorageTemperatureController {
  constructor(private readonly coldStorageTemperatureService: ColdStorageTemperatureService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/')
  @ApiOperation({ summary: 'Get all cold storages' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all cold storages',
    type: [ColdStorageTemperature],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  async findAll(
      @Query('month') month?: string,
      @Query('year') year?: string
  ) {
    const coldStorages = await this.coldStorageTemperatureService.getAllColdStorageTemperatures(
        month ? parseInt(month, 10) : undefined,
        year ? parseInt(year, 10) : undefined
    );
    return { error: null, data: coldStorages };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @ApiOperation({ summary: 'Get a cold storage by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cold storage details',
    type: ColdStorageTemperature,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cold storage not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  async findOne(@Param('id') id: string) {
    const coldStorage = await this.coldStorageTemperatureService.getColdStorageTemperatureById(id);
    return { error: null, data: coldStorage };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/')
  @ApiOperation({ summary: 'Create cold storage' })
  @ApiBody({ type: ColdStorageTemperatureDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cold storage successful',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async createTemperatures(@Body() coldStorageTemperaturesDto: ColdStorageTemperatureDTO[]) {
    const newColdStorageTemperature =
        await this.coldStorageTemperatureService.createTemperatures(coldStorageTemperaturesDto);

    return { error: null, data: newColdStorageTemperature };
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  @ApiOperation({ summary: 'Update a cold storage' })
  @ApiBody({ type: ColdStorageDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cold storage updated successfully',
    type: ColdStorageTemperature,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  async update(
      @Param('id') id: string,
      @Body() coldStorageTemperatureDto: ColdStorageTemperaturePatchDTO,
  ) {
    const updatedColdStorageTemperature = await this.coldStorageTemperatureService.updateTemperature(
        id,
        coldStorageTemperatureDto
    );

    return { error: null, data: updatedColdStorageTemperature };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a cold storage' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cold storage deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cold storage not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  async delete(@Param('id') id: string) {
    await this.coldStorageTemperatureService.deleteColdStorageTemperature(id);
    return { error: null, data: null };
  }
}
