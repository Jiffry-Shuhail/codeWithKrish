import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { Kafka } from 'kafkajs';

@Injectable()
export class ProductService implements OnModuleInit {
  // OnModuleInit interface implement use onModuleInit method for This module creation time executing

  // Kafka Event Drivent Object Create/Intilize
  // AWS kafka Part IP and Port Eg: IP: 3.0.159.213 | PORT: 9092
  // Possible to Docker image and Kafka in localhost to run
  private readonly Kafka = new Kafka({ brokers: ['3.0.159.213:9092'] });
  private readonly producer = this.Kafka.producer();
  // Group ID is must in unique
  private readonly consumer = this.Kafka.consumer({ groupId: 'jiffry-inventory-service' });

  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) { }
  async onModuleInit() {
    // Kafka Producer|Consumer Intilizingand Connect inside the Init Method
    await this.producer.connect();
    await this.consumer.connect();

    // Cosumer when start we need say what will be consumer can do
    await this.consumerOrderCreated();
  }

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

    if (!quantity) {
      throw new NotFoundException(`Quantity Query Parameter is Undefined`);
    }

    const quantityNumber = parseInt(quantity, 10);

    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      throw new BadRequestException(`Quantity is not Valid value`);
    }

    const product = await this.findOne(id);
    if (product) {
      return JSON.stringify({ available: product.quantity >= quantityNumber });
    } else {
      throw new NotFoundException(`Product with id: ${id} is not found`);
    }

  }

  async updateTheQuantity(id: number, updateProductDto: UpdateProductDto): Promise<Product | null> {

    if (!updateProductDto.quantity) {
      throw new NotFoundException(`Quantity Body Parameter is Undefined`);
    }
    const product = await this.findOne(id);
    if (product) {
      product.quantity -= updateProductDto.quantity;
      return await this.productRepository.save(product);
    } else {
      throw new NotFoundException(`Product with id: ${id} is not found`);
    }
  }

  async updateTheIncreaseQuantity(id: number, updateProductDto: UpdateProductDto): Promise<Product | null> {

    if (!updateProductDto.quantity) {
      throw new NotFoundException(`Quantity Body Parameter is Undefined`);
    }
    const product = await this.findOne(id);
    if (product) {
      product.quantity += updateProductDto.quantity;
      return await this.productRepository.save(product);
    } else {
      throw new NotFoundException(`Product with id: ${id} is not found`);
    }
  }

  async querySearch(query: string): Promise<Product[] | []> {
    return await this.productRepository.find({
      where: {
        name: Like(`%${query}%`),
        quantity: MoreThan(0)
      }
    });
  }

  async consumerOrderCreated() {
    // Producer send the event mention with topic name it's unique, and need to subscribe the cosumer then it will cathup
    await this.consumer.subscribe({ topic: 'jiffry.order.create', fromBeginning: true });

    // Once consumer is subcribe the topic event then we need to call and wrtie logic inside run->method
    await this.consumer.run({
      eachMessage: async ({ message }) => {

        if (message.value) {

          console.log('----- INVENTORY SERVICE -----', message.value.toString());

          const { customerId, customerName, items } = JSON.parse(message.value.toString());

          for (const item of items) {
            await this.updateTheQuantity(item.productId, {
              quantity: item.quantity,
              id: 0
            });
          }

          await this.producer.send({
            topic: 'jiffry.order.inventory.update',
            messages: [{ value: JSON.stringify({ customerId, customerName, items }) }]
          });
        }
      }

    });
  }
}
