import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { createOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatus } from './dto/update-order.dto';
import { HttpService } from '@nestjs/axios';
export declare class OrdersService {
    private readonly ordeReporsitory;
    private readonly orderItemsReporsitory;
    private readonly httpService;
    private readonly inventoryServiceUrl;
    private readonly customerServiceUrl;
    constructor(ordeReporsitory: Repository<Order>, orderItemsReporsitory: Repository<OrderItem>, httpService: HttpService);
    create(createOrderDto: createOrderDto): Promise<Order | null>;
    fetch(id: number): Promise<Order | null>;
    fetchAll(): Promise<Order[] | null>;
    updateOrderStatus(id: number, updateStatus: UpdateOrderStatus): Promise<Order | null>;
    updateOrdercancel(id: number, updateStatus: UpdateOrderStatus): Promise<Order | null>;
}
