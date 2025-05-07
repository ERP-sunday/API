import {
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';

export abstract class BaseController<T, CreateDto, UpdateDto> {
    abstract service: any;

    @Get('/')
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() query: any) {
        const data = await this.service.findAll(query);
        return { error: null, data };
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string) {
        const data = await this.service.findById(id);
        return { error: null, data };
    }

    @Post('/')
    @HttpCode(HttpStatus.OK)
    async create(@Body() createDto: CreateDto | CreateDto[]) {
        const data = await this.service.create(createDto);
        return { error: null, data };
    }

    @Patch('/:id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
        const data = await this.service.update(id, updateDto);
        return { error: null, data };
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: string) {
        await this.service.delete(id);
        return { error: null, data: null };
    }
}