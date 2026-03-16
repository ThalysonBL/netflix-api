import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './repositories/category.repository';
import { Category } from './entities/category.entity';


@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }
}


