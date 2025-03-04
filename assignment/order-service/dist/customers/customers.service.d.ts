import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
export declare class CustomersService {
    private readonly customerRepository;
    constructor(customerRepository: Repository<Customer>);
    create(createCustomerDto: CreateCustomerDto): Promise<Customer | null>;
    findAll(): Promise<Customer[] | null>;
    findOne(id: number): Promise<Customer | null>;
}
