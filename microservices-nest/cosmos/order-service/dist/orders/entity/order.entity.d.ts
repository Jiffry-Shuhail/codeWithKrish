import { OrderItem } from "./order-item.entity";
export declare class Order {
    id: number;
    customerId: number;
    createdAt: Date;
    status: string;
    items: OrderItem[];
}
