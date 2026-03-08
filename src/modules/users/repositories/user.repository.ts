import { User } from '../entities/user.entity';

export interface CreateUserData {
  name: string;
  birth_date: Date | string;
  phone: string;
  cpf: string;
  email: string;
  password: string;
}

export abstract class UserRepository {
  abstract create(data: CreateUserData): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByCpf(cpf: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
}
