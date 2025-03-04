import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<Product | null>;
    findAll(): Promise<Product[] | null>;
    findOne(id: number): Promise<Product | null>;
    validate(id: number, quantity: string): Promise<String>;
}
