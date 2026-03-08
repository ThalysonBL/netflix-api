import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserRepository } from './repositories/user.repository';
import { PrismaUserRepository } from './repositories/prisma/prisma-user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
