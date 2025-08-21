import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { FryerService } from '../services/fryer.service';
import { Fryer } from '../models/fryer.model';
import { FryerDTO } from '../dto/fryer.dto';
import { BaseController } from '../../../common/controllers/base.controller';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'fryer', version: '1' })
export class FryerController extends BaseController<Fryer, FryerDTO, FryerDTO> {
  public readonly service: FryerService;

  constructor(service: FryerService) {
    super();
    this.service = service;
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const data = await this.service.getAllFryers();
    return { error: null, data };
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const data = await this.service.getFryerById(id);
    return { error: null, data };
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async create(@Body() fryerDto: FryerDTO) {
    const data = await this.service.createFryer(fryerDto);
    return { error: null, data };
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() fryerDto: FryerDTO) {
    const data = await this.service.updateFryer(id, fryerDto);
    return { error: null, data };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    await this.service.deleteFryer(id);
    return { error: null, data: null };
  }
}
