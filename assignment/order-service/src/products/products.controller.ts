import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product | null> {

    if (!createProductDto.name || (createProductDto.name && createProductDto.name.trim().length === 0)) {
      throw new BadRequestException(`Empty name entry : ${createProductDto.name}`);
    }

    if (createProductDto.price && createProductDto.price <= 0) {
      throw new BadRequestException(`Invalid price entry : ${createProductDto.price}`);
    }

    if (createProductDto.quantity && createProductDto.quantity <= 0) {
      throw new BadRequestException(`Invalid quantity entry : ${createProductDto.quantity}`);
    }

    try {
      return await this.productsService.create(createProductDto);
    } catch (error) {
      throw new BadRequestException(error.sqlMessage);
    }

  }

  @Get()
  async findAll(): Promise<Product[] | null> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product | null> {
    return await this.productsService.findOne(id);
  }

  @Get(':id/validate')
  async validate(@Param('id') id: number, @Query('quantity') quantity: string): Promise<String> {
    return await this.productsService.validate(id, quantity);
  }
}
