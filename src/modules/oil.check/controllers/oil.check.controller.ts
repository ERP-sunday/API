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
import {OilCheckService} from "../services/oil.check.service";
import {OilCheck} from "../models/oil.check.model";
import {OilCheckDTO} from "../dto/oil.check.dto";

@ApiTags('oil-check')
@UseGuards(JwtAuthGuard)
@Controller({
    path: 'oil-check',
    version: '1',
})
export class OilCheckController {
    constructor(private readonly oilCheckService: OilCheckService) {}

    @HttpCode(HttpStatus.OK)
    @Get('/')
    @ApiOperation({ summary: 'Get all oil checks' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of all oil checks',
        type: [OilCheck],
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Something went wrong',
    })
    async findAll() {
        const oilChecks = await this.oilCheckService.getAllOilChecks();
        return { error: null, data: oilChecks };
    }

    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    @ApiOperation({ summary: 'Get an oil check by ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Oil check details',
        type: OilCheck,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Oil check not found',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Something went wrong',
    })
    async findOne(@Param('id') id: string) {
        const oilCheck = await this.oilCheckService.getOilCheckById(id);
        return { error: null, data: oilCheck };
    }

    @HttpCode(HttpStatus.OK)
    @Post('/')
    @ApiOperation({ summary: 'Create oil check' })
    @ApiBody({ type: OilCheckDTO })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Oil check created successfully',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials',
    })
    async create(@Body() oilCheckDto: OilCheckDTO) {
        const newOilCheck = await this.oilCheckService.createOilCheck(oilCheckDto);
        return { error: null, data: newOilCheck };
    }

    @HttpCode(HttpStatus.OK)
    @Patch('/:id')
    @ApiOperation({ summary: 'Update an oil check' })
    @ApiBody({ type: OilCheckDTO })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Oil check updated successfully',
        type: OilCheck,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Something went wrong',
    })
    async update(@Param('id') id: string, @Body() oilCheckDto: OilCheckDTO) {
        const updatedOilCheck = await this.oilCheckService.updateOilCheck(
            id,
            oilCheckDto,
        );
        return { error: null, data: updatedOilCheck };
    }

    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete an oil check' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Oil check deleted successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Oil check not found',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Something went wrong',
    })
    async delete(@Param('id') id: string) {
        await this.oilCheckService.deleteOilCheck(id);
        return { error: null, data: null };
    }
}