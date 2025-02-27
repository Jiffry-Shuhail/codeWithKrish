import { BadRequestException, Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { createOrderDto } from './dto/create-order.dto';
import { OrderStatus, UpdateOrderStatus } from './dto/update-order.dto';

@Injectable()
export class OrdersService {

    constructor(
        @InjectRepository(Order)
        private readonly ordeReporsitory: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemsReporsitory: Repository<OrderItem>
    ) { }

    public async create(createOrderDto: createOrderDto): Promise<Order|null> {
        const { customerId, items } = createOrderDto;

        // Create object in memory
        const order = this.ordeReporsitory.create({ customerId });

        // Save in database
        const savedOrder = await this.ordeReporsitory.save(order);

        // Create MultipleOder Items in memory
        const orderItems = items.map(({ productId, price, quantity }) =>
            this.orderItemsReporsitory.create({
                productId, price, quantity,
                order: savedOrder
            })
        );
        // Save in database
        await this.orderItemsReporsitory.save(orderItems);

        return this.ordeReporsitory.findOne({ 
            where: { id: savedOrder.id }, 
            relations: ['items'], 
        });
    }

    public async fetch(id:number):Promise<Order|null>{
        return await this.ordeReporsitory.findOne({ 
            where: { id}, 
            relations: ['items'], 
        });
    }

    public async fetchAll():Promise<Order[]|null>{
        return await this.ordeReporsitory.find({ 
            relations: ['items'], 
        });
    }

    public async updateOrderStatus(id:number, updateStatus:UpdateOrderStatus):Promise<Order|null>{
        const order=await this.ordeReporsitory.findOne({ where: { id}});
        if(!order){
            throw new NotFoundException(`order with id: ${id} is not found`);
        }

        if(order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED){
            throw new BadRequestException(`order status cannot be changed when its delivered or cancelled`);
        }

        order.status=updateStatus.status;

        return await this.ordeReporsitory.save(order);
    }
}
