import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {

  constructor(@InjectRepository(Customer) private readonly customerRepository: Repository<Customer>) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer | null> {

    if(!createCustomerDto.email || (createCustomerDto.email && createCustomerDto.email.trim().length===0)){
      throw new BadRequestException(`Empty email entry : ${createCustomerDto.email}`);
    }

    if(!createCustomerDto.name || (createCustomerDto.name && createCustomerDto.name.trim().length===0)){
      throw new BadRequestException(`Empty name entry : ${createCustomerDto.email}`);
    }
    
    const customer = this.customerRepository.create(createCustomerDto);
    try {
      return await this.customerRepository.save(customer);
    } catch (error) {
      if(error.code==='ER_DUP_ENTRY'){
        throw new BadRequestException(`Duplicate email entry : ${createCustomerDto.email}`);
      }
      throw new BadRequestException(error.sqlMessage);
    }
  }

  async findAll(): Promise<Customer[] | null> {
    return this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer | null> {
    const customer = this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      throw new NotFoundException(`Customer with id: ${id} is not found`);
    }

    return customer;
  }
}
