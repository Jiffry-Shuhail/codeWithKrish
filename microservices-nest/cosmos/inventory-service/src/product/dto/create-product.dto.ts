import { IsDecimal, IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @Min(1)
    @IsDecimal()
    price: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;
}
