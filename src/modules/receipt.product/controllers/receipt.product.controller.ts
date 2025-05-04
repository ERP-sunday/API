import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {ReceiptProductService} from "../services/receipt.product.service";
import {ReceiptProductDTO} from "../dto/receipt.product.dto";
import {ReceiptProduct} from "../models/receipt.product.model";

@ApiTags('receipt-product')
@UseGuards(JwtAuthGuard)
@Controller({
    path: 'receipt-product',
    version: '1',
})
export class ReceiptProductController {
    constructor(private readonly receiptProductService: ReceiptProductService) {}

    @HttpCode(HttpStatus.OK)
    @Post('/')
    @ApiOperation({ summary: 'Create a new receipt product' })
    @ApiBody({ type: ReceiptProductDTO })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Receipt product created successfully',
        type: ReceiptProduct,
    })
    async create(@Body() dto: ReceiptProductDTO) {
        const created = await this.receiptProductService.createProduct(dto);
        return { error: null, data: created };
    }

    @HttpCode(HttpStatus.OK)
    @Get('/')
    @ApiOperation({ summary: 'Get all receipt products' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of all receipt products',
        type: [ReceiptProduct],
    })
    async findAll() {
        const products = await this.receiptProductService.getAllProducts();
        return { error: null, data: products };
    }

    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a receipt product by ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Receipt product deleted',
    })
    async delete(@Param('id') id: string) {
        await this.receiptProductService.deleteProduct(id);
        return { error: null, data: null };
    }
}