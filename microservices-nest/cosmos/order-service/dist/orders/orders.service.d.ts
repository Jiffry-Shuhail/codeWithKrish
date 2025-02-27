import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { createOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatus } from './dto/update-order.dto';
export declare class OrdersService {
    private readonly ordeReporsitory;
    private readonly orderItemsReporsitory;
    constructor(ordeReporsitory: Repository<Order>, orderItemsReporsitory: Repository<OrderItem>);
    create(createOrderDto: createOrderDto): Promise<Order | null>;
    fetch(id: number): Promise<Order | null>;
    fetchAll(): Promise<Order[] | null>;
    updateOrderStatus(id: number, updateStatus: UpdateOrderStatus): Promise<Order | null>;
}
