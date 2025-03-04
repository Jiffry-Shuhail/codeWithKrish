import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
export declare class ProductsService {
    private readonly productRepository;
    constructor(productRepository: Repository<Product>);
    create(createProductDto: CreateProductDto): Promise<Product | null>;
    findAll(): Promise<Product[] | null>;
    findOne(id: number): Promise<Product | null>;
    validate(id: number, quantity: string): Promise<String>;
}
