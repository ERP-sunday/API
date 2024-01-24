import { OrderStatus } from "src/mongo/models/order.model";

export class OrderDTO {
    tableNumber: string;
    dishes: DishOrderDTO[];
    status: OrderStatus;
    totalPrice: number;
    tips: number;
    date: string;
}

class DishOrderDTO {
    dish: string;
    isPaid: boolean;
}