import { OnModuleInit } from '@nestjs/common';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { createOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatus } from './dto/update-order.dto';
import { HttpService } from '@nestjs/axios';
export declare class OrdersService implements OnModuleInit {
    private readonly ordeReporsitory;
    private readonly orderItemsReporsitory;
    private readonly httpService;
    private readonly Kafka;
    private readonly producer;
    private readonly consumer;
    private readonly inventoryServiceUrl;
    private readonly customerServiceUrl;
    constructor(ordeReporsitory: Repository<Order>, orderItemsReporsitory: Repository<OrderItem>, httpService: HttpService);
    onModuleInit(): Promise<void>;
    create(createOrderDto: createOrderDto): Promise<any>;
    fetch(id: number): Promise<Order | null>;
    fetchAll(): Promise<Order[] | null>;
    updateOrderStatus(id: number, updateStatus: UpdateOrderStatus): Promise<Order | null>;
    updateOrdercancel(id: number, updateStatus: UpdateOrderStatus): Promise<Order | null>;
    cosnsumeConfirmedOrders(): Promise<void>;
}
