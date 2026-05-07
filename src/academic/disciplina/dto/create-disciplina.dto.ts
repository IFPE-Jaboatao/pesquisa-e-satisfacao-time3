import { IsNumber, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"; // Importação necessária para limpar as linhas vermelhas

export class CreateDisciplinaDto {

    @ApiProperty({
        description: 'Nome da disciplina acadêmica',
        example: 'Programação Orientada a Objetos',
        minLength: 2
    })
    @IsString()
    @MinLength(2)
    nome!: string;

    @ApiProperty({
        description: 'ID do Curso (MySQL) ao qual a disciplina pertence',
        example: 1
    })
    @IsNumber()
    cursoId!: number;

    @ApiProperty({
        description: 'Código identificador da disciplina (ex: SIGA)',
        example: 'ADS001'
    })
    @IsString()
    @MinLength(2)
    codigo!: string;
}