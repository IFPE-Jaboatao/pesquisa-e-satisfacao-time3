import { IsNumber } from "class-validator";

export class CreateMatriculaDto {

    @IsNumber()
    alunoId!: number

    @IsNumber()
    turmaId!: number
    
}
