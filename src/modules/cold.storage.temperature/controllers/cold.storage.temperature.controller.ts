import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { ColdStorageTemperatureService } from '../services/cold.storage.temperature.service';
import { ColdStorageTemperatureDTO } from '../dto/cold.storage.temperature.dto';
import { ColdStorageTemperaturePatchDTO } from '../dto/cold.storage.temperature.patch.dto';
import { ColdStorageTemperature } from '../models/cold.storage.temperature.model';
import { DateRangeFilter } from '../../../common/filters/date.range.filter';
import { BaseController } from '../../../common/controllers/base.controller';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'cold-storage-temperature', version: '1' })
export class ColdStorageTemperatureController extends BaseController<
  ColdStorageTemperature,
  ColdStorageTemperatureDTO[],
  ColdStorageTemperaturePatchDTO
> {
  public readonly service: ColdStorageTemperatureService;

  constructor(service: ColdStorageTemperatureService) {
    super();
    this.service = service;
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('day') day?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const filter = new DateRangeFilter({
      year: year ? parseInt(year, 10) : undefined,
      month: month ? parseInt(month, 10) : undefined,
      day: day ? parseInt(day, 10) : undefined,
    });
    const coldStorages =
      await this.service.getAllColdStorageTemperatures(filter);
    return { error: null, data: coldStorages };
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const coldStorage = await this.service.getColdStorageTemperatureById(id);
    return { error: null, data: coldStorage };
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() coldStorageTemperaturesDto: ColdStorageTemperatureDTO[],
  ) {
    const newColdStorageTemperature = await this.service.createTemperatures(
      coldStorageTemperaturesDto,
    );
    return { error: null, data: newColdStorageTemperature };
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() coldStorageTemperatureDto: ColdStorageTemperaturePatchDTO,
  ) {
    const updatedColdStorageTemperature = await this.service.updateTemperature(
      id,
      coldStorageTemperatureDto,
    );
    return { error: null, data: updatedColdStorageTemperature };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    await this.service.deleteColdStorageTemperature(id);
    return { error: null, data: null };
  }
}
