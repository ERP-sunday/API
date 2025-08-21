import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { OilCheckService } from '../services/oil.check.service';
import { OilCheckDTO } from '../dto/oil.check.dto';
import { DateRangeFilter } from '../../../common/filters/date.range.filter';
import { BaseController } from '../../../common/controllers/base.controller';
import { OilCheckPatchDTO } from '../dto/oil.check.patch.dto';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'oil-check', version: '1' })
export class OilCheckController extends BaseController<
  OilCheckDTO,
  OilCheckPatchDTO
> {
  public readonly service: OilCheckService;

  constructor(service: OilCheckService) {
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
      day: day ? parseInt(day, 10) : undefined,
      month: month ? parseInt(month, 10) : undefined,
      year: year ? parseInt(year, 10) : undefined,
    });

    const data = await this.service.getAllOilChecks(filter);
    return { error: null, data };
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const data = await this.service.getOilCheckById(id);
    return { error: null, data };
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async create(@Body() oilCheckDto: OilCheckDTO) {
    const data = await this.service.createOilCheck(oilCheckDto);
    return { error: null, data };
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() oilCheckDto: OilCheckPatchDTO) {
    const data = await this.service.updateOilCheck(id, oilCheckDto);
    return { error: null, data };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    await this.service.deleteOilCheck(id);
    return { error: null, data: null };
  }
}
