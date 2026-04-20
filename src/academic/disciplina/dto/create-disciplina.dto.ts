import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateDisciplinaDto {

    @IsString()
    @MinLength(2)
    nome!: string;

    @IsNumber()
    cursoId!: number

}
