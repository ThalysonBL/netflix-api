import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const user = await this.userService.create(createAuthDto);
    return AuthService.omitPassword(user);
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { login, password } = loginAuthDto;
    const user = await this.userService.findByEmailOrCpf(login);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    const access_token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { access_token, user: AuthService.omitPassword(user) };
  }

  private static omitPassword(user: User) {
    const { password: _, ...rest } = user;
    return rest;
  }
}