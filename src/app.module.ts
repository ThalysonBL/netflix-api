import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, CategoriesModule],
})
export class AppModule {}
