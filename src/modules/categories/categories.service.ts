import { Injectable, Post } from '@nestjs/common';
import { CategoryRepository } from './repositories/category.repository';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create.category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }

  @Post()
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.create(createCategoryDto);
  }
}


