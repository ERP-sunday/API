import { IsNumber } from "class-validator"

export class RestaurantTableDTO {
    @IsNumber()
    number: number
}