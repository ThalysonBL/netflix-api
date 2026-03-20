import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Category } from '../../entities/category.entity';
import { CategoryRepository } from '../category.repository';
import { CreateCategoryDto } from '../../dto/create.category.dto';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return await this.prisma.category.findMany();
  }
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        slug: createCategoryDto.slug,
      },
    });
  }
}
