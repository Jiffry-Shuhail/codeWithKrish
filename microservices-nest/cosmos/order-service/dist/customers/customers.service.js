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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("./entities/customer.entity");
const typeorm_2 = require("typeorm");
let CustomersService = class CustomersService {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async create(createCustomerDto) {
        if (!createCustomerDto.email || (createCustomerDto.email && createCustomerDto.email.trim().length === 0)) {
            throw new common_1.BadRequestException(`Empty email entry : ${createCustomerDto.email}`);
        }
        if (!createCustomerDto.name || (createCustomerDto.name && createCustomerDto.name.trim().length === 0)) {
            throw new common_1.BadRequestException(`Empty name entry : ${createCustomerDto.email}`);
        }
        const customer = this.customerRepository.create(createCustomerDto);
        try {
            return await this.customerRepository.save(customer);
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new common_1.BadRequestException(`Duplicate email entry : ${createCustomerDto.email}`);
            }
            throw new common_1.BadRequestException(error.sqlMessage);
        }
    }
    async findAll() {
        return this.customerRepository.find();
    }
    async findOne(id) {
        const customer = this.customerRepository.findOne({ where: { id } });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with id: ${id} is not found`);
        }
        return customer;
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomersService);
//# sourceMappingURL=customers.service.js.map