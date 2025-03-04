"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const orders_module_1 = require("./orders/orders.module");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./orders/entity/order.entity");
const order_item_entity_1 = require("./orders/entity/order-item.entity");
const customers_module_1 = require("./customers/customers.module");
const customer_entity_1 = require("./customers/entities/customer.entity");
const products_module_1 = require("./products/products.module");
const product_entity_1 = require("./products/entities/product.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [orders_module_1.OrdersModule, typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.HOSTNAME || 'localhost',
                port: 3306,
                username: 'root',
                password: 'admin',
                database: 'cosmos',
                entities: [order_entity_1.Order, order_item_entity_1.OrderItem, customer_entity_1.Customer, product_entity_1.Product],
                synchronize: true
            }), customers_module_1.CustomersModule, products_module_1.ProductsModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map