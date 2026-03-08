import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { DuplicateUserFieldError } from './errors/duplicate-user-field.error';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  private static readonly SALT_ROUNDS = 10;

  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { name, birth_date, phone, email, password, cpf } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, UsersService.SALT_ROUNDS);
    try {
      return await this.userRepository.create({
        name,
        birth_date,
        phone,
        email,
        password: hashedPassword,
        cpf,
      });
    } catch (error) {
      if (error instanceof DuplicateUserFieldError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findByEmailOrCpf(login: string) {
    return this.looksLikeEmail(login)
      ? this.userRepository.findByEmail(login)
      : this.userRepository.findByCpf(login);
  }

  private looksLikeEmail(value: string): boolean {
    return value.includes('@');
  }
}
