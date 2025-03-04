import { BadRequestException, Body, Injectable, NotFoundException, OnModuleInit, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { createOrderDto } from './dto/create-order.dto';
import { OrderStatus, UpdateOrderStatus } from './dto/update-order.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Kafka } from 'kafkajs';

@Injectable()
export class OrdersService implements OnModuleInit {
    // OnModuleInit interface implement use onModuleInit method for This module creation time executing

    // Kafka Event Drivent Object Create/Intilize
    // AWS kafka Part IP and Port Eg: IP: 3.0.159.213 | PORT: 9092
    // Possible to Docker image and Kafka in localhost to run
    private readonly Kafka = new Kafka({ brokers: ['3.0.159.213:9092'] });
    private readonly producer = this.Kafka.producer();
    // Group ID is must in unique
    private readonly consumer = this.Kafka.consumer({ groupId: 'jiffry-order-service' });

    private readonly inventoryServiceUrl = 'http://localhost:3001/products';
    private readonly customerServiceUrl = 'http://localhost:3002/customers';

    constructor(
        @InjectRepository(Order)
        private readonly ordeReporsitory: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemsReporsitory: Repository<OrderItem>,
        private readonly httpService: HttpService
    ) { }
    async onModuleInit() {
        await this.producer.connect();
        await this.consumer.connect();
        await this.cosnsumeConfirmedOrders();
    }

    public async create(createOrderDto: createOrderDto): Promise<any> {
        const { customerId, city, items } = createOrderDto;

        let customerName = '';
        try {
            const request = this.httpService.get(`${this.customerServiceUrl}/${customerId}`);
            const response = await lastValueFrom(request);
            if (!response.data.id) {
                throw new BadRequestException(`Customer ID ${customerId} is invalid.`);
            } else {
                customerName = response.data.name;
            }
        } catch (error) {
            throw new BadRequestException(`Error checking Customer for Customer ID ${customerId}: ${error.message}`);
        }

        // Produce order an Event
        // SEND IS START
        this.producer.send({
            topic: 'jiffry.order.create',
            messages: [{ value: JSON.stringify({ customerId, customerName, city, items }) }]
        });
        // SEND IS END

        return { message: `Order is placed. waiting inventory service to process` };

        /* THE COMMENTED LOGIC PART WILL HANDLING KAFKA EVENT DRIVEN THORUGH

        // Inside the not Allow any loop|Ierator except For loop
        // So I used the For for iterating
        for (const item of items) {
            try {
                const request = this.httpService.get(
                    `${this.inventoryServiceUrl}/${item.productId}/validate?quantity=${item.quantity}`
                )
                const response = await lastValueFrom(request);

                if (!response.data.available) {
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
        const savedOrderItems = await this.orderItemsReporsitory.save(orderItems);
        console.log(savedOrderItems);

        for (const item of savedOrderItems) {
            try {
                const request = this.httpService.patch(
                    `${this.inventoryServiceUrl}/${item.productId}/reduce`, { quantity: item.quantity }
                )
                const response = await lastValueFrom(request);
                if (!response.data.id) {
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

        */
    }

    public async fetch(id: number): Promise<Order | null> {
        return await this.ordeReporsitory.findOne({
            where: { id },
            relations: ['items'],
        });
    }

    public async fetchAll(): Promise<Order[] | null> {
        return await this.ordeReporsitory.find({
            relations: ['items'],
        });
    }

    public async updateOrderStatus(id: number, updateStatus: UpdateOrderStatus): Promise<Order | null> {
        const order = await this.ordeReporsitory.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException(`order with id: ${id} is not found`);
        }

        if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
            throw new BadRequestException(`order status cannot be changed when its delivered or cancelled`);
        }

        order.status = updateStatus.status;

        return await this.ordeReporsitory.save(order);
    }

    public async updateOrdercancel(id: number, updateStatus: UpdateOrderStatus): Promise<Order | null> {
        const order = await this.ordeReporsitory.findOne({ where: { id }, relations: ['items'] });
        if (!order) {
            throw new NotFoundException(`order with id: ${id} is not found`);
        }

        if (order.status !== OrderStatus.CANCELLED) {
            order.status = updateStatus.status;
            for (const item of order.items) {
                try {
                    const request = this.httpService.patch(
                        `${this.inventoryServiceUrl}/${item.productId}/increase`, { quantity: item.quantity }
                    )
                    const response = await lastValueFrom(request);
                    if (!response.data.id) {
                        throw new BadRequestException(`Product ID ${item.productId} is not found.`);
                    }
                } catch (error) {
                    throw new BadRequestException(`Error checking stock reduing for Product ID ${item.productId}: ${error.message}`);
                }
            }
        } else {
            throw new BadRequestException(`order status cannot be changed when its delivered`);
        }



        return await this.ordeReporsitory.save(order);
    }

    async cosnsumeConfirmedOrders() {
        // Producer send the event mention with topic name it's unique, and need to subscribe the cosumer then it will cathup
        await this.consumer.subscribe({ topic: 'jiffry.order.inventory.update', fromBeginning: true });

        // Once consumer is subcribe the topic event then we need to call and wrtie logic inside run->method
        await this.consumer.run({
            eachMessage: async ({ message }) => {

                if (message.value) {
                    console.log('----- ORDER SERVICE -----', message.value.toString());

                    const { customerId, customerName, city, items } = JSON.parse(message.value.toString());

                    const order = this.ordeReporsitory.create({ customerId, city, status: OrderStatus.CONFIRMED });
                    const savedOrder = await this.ordeReporsitory.save(order);

                    const oderItems = items.map(({ productId, price, quantity }) => this.orderItemsReporsitory.create({ productId, price, quantity, order: savedOrder }));
                    await this.orderItemsReporsitory.save(oderItems);

                    await this.producer.send({
                        topic: 'jiffry.order.confirmed',
                        messages: [{ value:JSON.stringify({city, orderId:savedOrder.id }) }]
                    });
                }

            }
        })
    }
}
