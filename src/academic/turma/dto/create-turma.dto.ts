import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateTurmaDto {

    @IsString()
    @MinLength(2)
    nome!: string;

    @IsNumber()
    disciplinaId!: number

    @IsNumber()
    periodoId!: number

    @IsNumber()
    docenteId!: number

}
