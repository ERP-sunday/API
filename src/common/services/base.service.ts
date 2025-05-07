import {
    BadRequestException,
    ConflictException,
    HttpException,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

export abstract class BaseService {
    protected readonly logger = new Logger(this.constructor.name);

    protected assertFound<T>(entity: T | null, message?: string): T {
        if (!entity) {
            throw new NotFoundException(message || 'Entity not found');
        }
        return entity;
    }

    protected handleError(error: any): never {
        const stack = new Error().stack;
        const caller = stack?.split('\n')[2]?.trim().split(' ')[1] || 'unknown';
        this.logger.error(`[${caller}] ${error?.message || error}`, error?.stack || '');

        if (error instanceof HttpException) throw error;

        if (error?.name === 'ValidationError') {
            throw new BadRequestException(error.message);
        }

        if (error?.code === 11000) {
            throw new ConflictException('Duplicate entry');
        }

        throw new InternalServerErrorException(`Unexpected error in ${caller}`);
    }
}