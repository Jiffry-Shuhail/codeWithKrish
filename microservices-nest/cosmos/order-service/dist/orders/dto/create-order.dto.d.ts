declare class OrderItemsDto {
    productId: number;
    price: number;
    quantity: number;
}
export declare class createOrderDto {
    customerId: number;
    items: OrderItemsDto[];
}
export {};
