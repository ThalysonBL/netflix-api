import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'E-mail ou CPF do usuário',
  })
  @IsString({ message: 'Login deve ser um texto.' })
  @IsNotEmpty({ message: 'Login é obrigatório.' })
  @MinLength(5, { message: 'Login deve ter no mínimo 5 caracteres.' })
  login: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString({ message: 'Senha deve ser um texto.' })
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres.' })
  password: string;
}