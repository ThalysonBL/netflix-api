import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString({ message: 'Nome deve ser um texto.' })
    @IsNotEmpty({ message: 'Nome é obrigatório.' })
    name: string;
    @IsString({ message: 'Slug deve ser um texto.' })
    @IsNotEmpty({ message: 'Slug é obrigatório.' })
    slug: string;
}
