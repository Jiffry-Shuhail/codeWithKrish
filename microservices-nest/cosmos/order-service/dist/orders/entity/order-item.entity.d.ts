import { Order } from "./order.entity";
export declare class OrderItem {
    id: number;
    productId: number;
    price: number;
    quantity: number;
    order: Order;
}
