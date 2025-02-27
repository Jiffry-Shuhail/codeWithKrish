import { Type } from "class-transformer";
import { IsArray, IsDecimal, IsInt, ValidateNested } from "class-validator";

class OrderItemsDto{

    @IsInt()
    productId:number;

    @IsDecimal()
    price:number;

    @IsInt()
    quantity:number;
}


export class createOrderDto{

    @IsInt()
    customerId:number;

    @IsArray()
    @ValidateNested({each:true})
    @Type(()=>OrderItemsDto)
    items:OrderItemsDto[];
}