import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

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
      return await this.productService.create(createProductDto);
    } catch (error) {
      throw new BadRequestException(error.sqlMessage);
    }

  }

  @Get()
  async findAll(): Promise<Product[] | null> {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product | null> {
    return await this.productService.findOne(id);
  }

  @Get(':id/validate')
  async validate(@Param('id') id: number, @Query('quantity') quantity: string): Promise<String> {
    return await this.productService.validate(id, quantity);
  }

  @Patch(':id/reduce')
  async updateTheQuantity(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<Product | null> {
    return await this.productService.updateTheQuantity(id, updateProductDto);
  }

  @Patch(':id/increase')
  async updateTheIncreaseQuantity(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<Product | null> {
    return await this.productService.updateTheIncreaseQuantity(id, updateProductDto);
  }

  @Get(':query/filter')
  async querySearch(@Param('query') query: string): Promise<Product[] | []> {
    return await this.productService.querySearch(query);
  }

}
