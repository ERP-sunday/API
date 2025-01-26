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
import { ColdStorageService } from '../services/cold.storage.service';
import { ColdStorageDTO } from 'src/modules/cold.storage/dto/cold.storage.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { ColdStorage } from '../models/cold.storage.model';

@ApiTags('cold-storage')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'cold-storage',
  version: '1',
})
export class ColdStorageController {
  constructor(private readonly coldStorageService: ColdStorageService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/')
  @ApiOperation({ summary: 'Get all cold storages' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all cold storages',
    type: [ColdStorage],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  async findAll() {
    const coldStorages = await this.coldStorageService.getAllColdStorages();
    return { error: null, data: coldStorages };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @ApiOperation({ summary: 'Get a cold storage by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cold storage details',
    type: ColdStorage,
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
    const coldStorage = await this.coldStorageService.getColdStorageById(id);
    return { error: null, data: coldStorage };
  }

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

  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  @ApiOperation({ summary: 'Update a cold storage' })
  @ApiBody({ type: ColdStorageDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cold storage updated successfully',
    type: ColdStorage,
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
    @Body() coldStorageDto: ColdStorageDTO,
  ) {
    const updatedColdStorage = await this.coldStorageService.updateColdStorage(
      id,
      coldStorageDto,
    );
    return { error: null, data: updatedColdStorage };
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
    await this.coldStorageService.deleteColdStorage(id);
    return { error: null, data: null };
  }
}
