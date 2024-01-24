import { OrderStatus } from "src/mongo/models/order.model";

export class OrderDTO {
    tableNumberId: string;
    dishes: DishOrderDTO[];
    status: OrderStatus;
    totalPrice: number;
    tips: number;
    date: string;
}

class DishOrderDTO {
    dishId: string;
    isPaid: boolean;
}