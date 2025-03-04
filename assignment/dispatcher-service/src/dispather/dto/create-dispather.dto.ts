import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
export class CreateDispatherDto {
    
    @IsNotEmpty()
    @MinLength(1)
    vehicle_number: string;

    city: string;
}
