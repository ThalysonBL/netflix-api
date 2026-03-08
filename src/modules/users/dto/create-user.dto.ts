import { IsDateString, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsDateString()
    birth_date: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(11)
    cpf: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    phone: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}