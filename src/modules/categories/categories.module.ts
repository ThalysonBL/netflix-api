import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryRepository } from './repositories/category.repository';
import { PrismaCategoryRepository } from './repositories/prisma/prisma-category.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
  ],
})
export class CategoriesModule {}
