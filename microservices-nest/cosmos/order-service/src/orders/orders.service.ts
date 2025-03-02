import { BadRequestException, Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { createOrderDto } from './dto/create-order.dto';
import { OrderStatus, UpdateOrderStatus } from './dto/update-order.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {

    private readonly inventoryServiceUrl = 'http://localhost:3001/products';
    private readonly customerServiceUrl = 'http://localhost:3002/customers';

    constructor(
        @InjectRepository(Order)
        private readonly ordeReporsitory: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemsReporsitory: Repository<OrderItem>,
        private readonly httpService:HttpService
    ) { }

    public async create(createOrderDto: createOrderDto): Promise<Order|null> {
        const { customerId, items } = createOrderDto;

        try {
            const request=this.httpService.get(`${this.customerServiceUrl}/${customerId}`);
            const response=await lastValueFrom(request);
            if(!response.data.id){
                throw new BadRequestException(`Customer ID ${customerId} is invalid.`);
            }
        } catch (error) {
            throw new BadRequestException(`Error checking Customer for Customer ID ${customerId}: ${error.message}`);
        }

        // Inside the not Allow any loop|Ierator except For loop
        // So I used the For for iterating
        for(const item of items){
            try {
                const request=this.httpService.get(
                    `${this.inventoryServiceUrl}/${item.productId}/validate?quantity=${item.quantity}`
                )
                const response=await lastValueFrom(request);
                
                if(!response.data.available){
                    throw new BadRequestException(`Product ID ${item.productId} is out of stock.`);
                }
            } catch (error) {
                throw new BadRequestException(`Error checking stock for Product ID ${item.productId}: ${error.message}`);
            }
        }

        

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
        const savedOrderItems=await this.orderItemsReporsitory.save(orderItems);
        console.log(savedOrderItems);

        for(const item of savedOrderItems){
            try {
                const request=this.httpService.patch(
                    `${this.inventoryServiceUrl}/${item.productId}/reduce`, {quantity:item.quantity}
                )
                const response=await lastValueFrom(request);
                if(!response.data.id){
                    throw new BadRequestException(`Product ID ${item.productId} is not found.`);
                }
            } catch (error) {
                throw new BadRequestException(`Error checking stock reduing for Product ID ${item.productId}: ${error.message}`);
            }
        }

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
