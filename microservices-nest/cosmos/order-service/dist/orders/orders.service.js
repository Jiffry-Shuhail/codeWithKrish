"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./entity/order.entity");
const typeorm_2 = require("typeorm");
const order_item_entity_1 = require("./entity/order-item.entity");
const update_order_dto_1 = require("./dto/update-order.dto");
let OrdersService = class OrdersService {
    ordeReporsitory;
    orderItemsReporsitory;
    constructor(ordeReporsitory, orderItemsReporsitory) {
        this.ordeReporsitory = ordeReporsitory;
        this.orderItemsReporsitory = orderItemsReporsitory;
    }
    async create(createOrderDto) {
        const { customerId, items } = createOrderDto;
        const order = this.ordeReporsitory.create({ customerId });
        const savedOrder = await this.ordeReporsitory.save(order);
        const orderItems = items.map(({ productId, price, quantity }) => this.orderItemsReporsitory.create({
            productId, price, quantity,
            order: savedOrder
        }));
        await this.orderItemsReporsitory.save(orderItems);
        return this.ordeReporsitory.findOne({
            where: { id: savedOrder.id },
            relations: ['items'],
        });
    }
    async fetch(id) {
        return await this.ordeReporsitory.findOne({
            where: { id },
            relations: ['items'],
        });
    }
    async fetchAll() {
        return await this.ordeReporsitory.find({
            relations: ['items'],
        });
    }
    async updateOrderStatus(id, updateStatus) {
        const order = await this.ordeReporsitory.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException(`order with id: ${id} is not found`);
        }
        if (order.status === update_order_dto_1.OrderStatus.DELIVERED || order.status === update_order_dto_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException(`order status cannot be changed when its delivered or cancelled`);
        }
        order.status = updateStatus.status;
        return await this.ordeReporsitory.save(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map