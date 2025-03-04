import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateCustomerDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @MinLength(1)
    email: string;

    address: string;
}
