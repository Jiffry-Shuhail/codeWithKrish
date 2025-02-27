import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto):Promise<Customer|null> {
    return await this.customersService.create(createCustomerDto);
  }

  @Get()
  async findAll():Promise<Customer[]|null> {
    return await this.customersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number):Promise<Customer|null> {
    return await this.customersService.findOne(id);
  }
}
