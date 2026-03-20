import { CreateCategoryDto } from "../dto/create.category.dto";
import { Category } from "../entities/category.entity";

export abstract class CategoryRepository {
    abstract findAll(): Promise<Category[]>;
    abstract create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    
}
