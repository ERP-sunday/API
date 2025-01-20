import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res, UseGuards
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { ColdStorageService } from '../services/cold.storage.service';
import { ColdStorageDTO } from 'src/modules/cold.storage/dto/cold.storage.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('cold-storage')
@UseGuards(AuthGuard)
@Controller({
  path: 'cold-storage',
  version: '1',
})
export class ColdStorageController {
  constructor(private readonly coldStorageService: ColdStorageService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/')
  @ApiOperation({ summary: 'Create cold storage' })
  @ApiBody({ type: ColdStorageDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cold storage successful',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async create(@Body() coldStorageDto: ColdStorageDTO) {
    const newColdStorage =
      await this.coldStorageService.createColdStorage(coldStorageDto);

    return { error: null, data: newColdStorage };
  }
}
