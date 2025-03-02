import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { createOrderDto } from './dto/create-order.dto';
import { Order } from './entity/order.entity';
import { UpdateOrderStatus } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {

    constructor(private orderService:OrdersService){}

    @Post()
    async getOrder(@Body() createOrderDto:createOrderDto):Promise<Order|null>{
        return await this.orderService.create(createOrderDto);
    }

    @Get(':id')
    async fetch(@Param('id') id:number):Promise<Order|null>{
        return await this.orderService.fetch(id);
    }

    @Get()
    async fetchAll():Promise<Order[]|null>{
        return await this.orderService.fetchAll();
    }

    @Patch(':id/status')
    async updateOrderStatus(@Param('id') id:number, @Body() updateOrderStatus:UpdateOrderStatus):Promise<Order|null>{
        return await this.orderService.updateOrderStatus(id, updateOrderStatus);
    }

    @Patch(':id/cancel')
    async updateOrdercancel(@Param('id') id:number, @Body() updateOrderStatus:UpdateOrderStatus):Promise<Order|null>{
        return await this.orderService.updateOrdercancel(id, updateOrderStatus);
    }
}
