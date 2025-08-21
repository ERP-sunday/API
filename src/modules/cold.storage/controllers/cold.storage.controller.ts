import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { ColdStorageService } from '../services/cold.storage.service';
import { ColdStorageDTO } from '../dto/cold.storage.dto';
import { BaseController } from '../../../common/controllers/base.controller';
import { ColdStoragePatchDTO } from '../dto/cold.storage.patch.dto';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'cold-storage',
  version: '1',
})
export class ColdStorageController extends BaseController<
  ColdStorageDTO,
  ColdStoragePatchDTO
> {
  public readonly service: ColdStorageService;

  constructor(service: ColdStorageService) {
    super();
    this.service = service;
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const data = await this.service.getAllColdStorages();
    return { error: null, data };
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const data = await this.service.getColdStorageById(id);
    return { error: null, data };
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: ColdStorageDTO) {
    const data = await this.service.createColdStorage(dto);
    return { error: null, data };
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: ColdStoragePatchDTO) {
    const data = await this.service.updateColdStorage(id, dto);
    return { error: null, data };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    await this.service.deleteColdStorage(id);
    return { error: null, data: null };
  }
}
