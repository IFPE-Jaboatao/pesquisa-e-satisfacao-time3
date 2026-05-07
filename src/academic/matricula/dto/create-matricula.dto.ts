import { IsNumber, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMatriculaDto {

    @ApiProperty({
        description: 'ID do Aluno (usuário com role ALUNO) no MySQL',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty({ message: 'O ID do aluno é obrigatório.' })
    alunoId!: number;

    @ApiProperty({
        description: 'ID da Turma (MySQL) na qual o aluno será matriculado',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty({ message: 'O ID da turma é obrigatório.' })
    turmaId!: number;

}