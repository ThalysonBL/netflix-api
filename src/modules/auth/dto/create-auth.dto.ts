import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ example: 'John Doe', minLength: 3 })
  @IsString({ message: 'Nome deve ser um texto.' })
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres.' })
  name: string;

  @ApiProperty({ example: '1990-01-15', description: 'Birth date (ISO 8601)' })
  @IsString({ message: 'Data de nascimento deve ser um texto.' })
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória.' })
  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida (ISO 8601).' })
  birth_date: string;

  @ApiProperty({ example: '12345678901', minLength: 11 })
  @IsString({ message: 'CPF deve ser um texto.' })
  @IsNotEmpty({ message: 'CPF é obrigatório.' })
  @MinLength(11, { message: 'CPF deve ter no mínimo 11 caracteres.' })
  cpf: string;

  @ApiProperty({ example: '11999999999', minLength: 3 })
  @IsString({ message: 'Telefone deve ser um texto.' })
  @IsNotEmpty({ message: 'Telefone é obrigatório.' })
  @MinLength(3, { message: 'Telefone deve ter no mínimo 3 caracteres.' })
  phone: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsString({ message: 'E-mail deve ser um texto.' })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString({ message: 'Senha deve ser um texto.' })
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres.' })
  password: string;
}
