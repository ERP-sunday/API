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
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { SupplierService } from '../services/supplier.service';
import { SupplierDTO } from '../dto/supplier.dto';
import { Supplier } from '../models/supplier.model';

@ApiTags('supplier')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'supplier',
  version: '1',
})
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/')
  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of suppliers',
    type: [Supplier],
  })
  async findAll() {
    const suppliers = await this.supplierService.getAllSuppliers();
    return { error: null, data: suppliers };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @ApiOperation({ summary: 'Get a supplier by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier found',
    type: Supplier,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  async findOne(@Param('id') id: string) {
    const supplier = await this.supplierService.getSupplierById(id);
    return { error: null, data: supplier };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/')
  @ApiOperation({ summary: 'Create supplier' })
  @ApiBody({ type: SupplierDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier created',
  })
  async create(@Body() dto: SupplierDTO) {
    const supplier = await this.supplierService.createSupplier(dto);
    return { error: null, data: supplier };
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  @ApiOperation({ summary: 'Update supplier' })
  @ApiBody({ type: SupplierDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier updated',
    type: Supplier,
  })
  async update(@Param('id') id: string, @Body() dto: SupplierDTO) {
    const updated = await this.supplierService.updateSupplier(id, dto);
    return { error: null, data: updated };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete supplier' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier deleted',
  })
  async delete(@Param('id') id: string) {
    await this.supplierService.deleteSupplier(id);
    return { error: null, data: null };
  }
}
