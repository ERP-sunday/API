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
import { CoolingService } from '../services/cooling.service';
import { CoolingDTO } from '../dto/cooling.dto';
import { CoolingPatchDTO } from '../dto/cooling.patch.dto';
import { CoolingFinishDTO } from '../dto/cooling.finish.dto';
import { BaseController } from '../../../common/controllers/base.controller';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'cooling', version: '1' })
export class CoolingController extends BaseController<CoolingDTO, CoolingPatchDTO> {
  public readonly service: CoolingService;

  constructor(service: CoolingService) {
    super();
    this.service = service;
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const data = await this.service.getAllCoolings();
    return { error: null, data };
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const data = await this.service.getCoolingById(id);
    return { error: null, data };
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async create(@Body() coolingDto: CoolingDTO) {
    const data = await this.service.createCooling(coolingDto);
    return { error: null, data };
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() coolingPatchDto: CoolingPatchDTO) {
    const data = await this.service.updateCooling(id, coolingPatchDto);
    return { error: null, data };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    await this.service.deleteCooling(id);
    return { error: null, data: null };
  }


  @Patch('/:id/finish')
  @HttpCode(HttpStatus.OK)
  async finishCooling(@Param('id') id: string, @Body() finishDto: CoolingFinishDTO) {
    const data = await this.service.finishCooling(id, finishDto);
    return { error: null, data };
  }
}
