import { IsString, IsArray, IsEnum, IsNumber, IsOptional, ValidateNested, IsBoolean } from 'class-validator';
import { OrderStatus } from "src/mongo/models/order.model";
import { Type } from 'class-transformer';

export class OrderDTO {
    @IsString()
    tableNumberId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DishOrderDTO)
    dishes: DishOrderDTO[];

    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsNumber()
    totalPrice: number;

    @IsNumber()
    tips: number;

    @IsString()
    date: string;

    @IsOptional()
    @IsString()
    creationDate?: string;
}

export class DishOrderDTO {
    @IsString()
    dishId: string;

    @IsBoolean()
    isPaid: boolean;
}