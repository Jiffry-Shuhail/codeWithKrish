import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) { }

  async create(createProductDto: CreateProductDto): Promise<Product | null> {

    const product = this.productRepository.create(createProductDto);

    try {
      return await this.productRepository.save(product);
    } catch (error) {
      throw new BadRequestException(error.sqlMessage);
    }
  }

  async findAll(): Promise<Product[] | null> {
    return await this.productRepository.find();;
  }

  async findOne(id: number): Promise<Product | null> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} is not found`);
    }
    return product;
  }

  async validate(id: number, quantity: string): Promise<String> {

    if(!quantity){
      throw new NotFoundException(`Quantity Query Parameter is Undefined`);
    }

    const quantityNumber = parseInt(quantity, 10);

    if(isNaN(quantityNumber) || quantityNumber<=0){
      throw new BadRequestException(`Quantity is not Valid value`);
    }

    const product = await this.findOne(id);
    if (product) {
      return JSON.stringify({ available: product.quantity >= quantityNumber });
    } else {
      throw new NotFoundException(`Product with id: ${id} is not found`);
    }

  }
}
