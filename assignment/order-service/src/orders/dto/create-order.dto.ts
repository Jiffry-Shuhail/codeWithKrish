import { Type } from "class-transformer";
import { IsArray, IsDecimal, IsInt, IsNotEmpty, isNotEmpty, ValidateNested } from "class-validator";

class OrderItemsDto {

    @IsInt()
    productId: number;

    @IsDecimal()
    price: number;

    @IsInt()
    quantity: number;
}


export class createOrderDto {

    @IsInt()
    customerId: number;

    @IsNotEmpty()
    city: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemsDto)
    items: OrderItemsDto[];
}