import { OrdersService } from './orders.service';
import { createOrderDto } from './dto/create-order.dto';
import { Order } from './entity/order.entity';
import { UpdateOrderStatus } from './dto/update-order.dto';
export declare class OrdersController {
    private orderService;
    constructor(orderService: OrdersService);
    getOrder(createOrderDto: createOrderDto): Promise<Order | null>;
    fetch(id: number): Promise<Order | null>;
    fetchAll(): Promise<Order[] | null>;
    updateOrderStatus(id: number, updateOrderStatus: UpdateOrderStatus): Promise<Order | null>;
    updateOrdercancel(id: number, updateOrderStatus: UpdateOrderStatus): Promise<Order | null>;
}
