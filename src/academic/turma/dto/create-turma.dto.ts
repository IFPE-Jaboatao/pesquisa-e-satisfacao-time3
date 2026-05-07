import { IsEnum, IsNumber, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Turnos } from "../turma-turnos.enum";

export class CreateTurmaDto {

    @ApiProperty({
        description: 'Nome da turma',
        example: 'ADS - 3º Período - Noite',
        minLength: 2
    })
    @IsString()
    @MinLength(2)
    nome!: string;

    @ApiProperty({
        description: 'Turno da turma (MANHA, TARDE, NOITE)',
        enum: Turnos,
        example: Turnos.NOITE
    })
    @IsEnum(Turnos)
    turno!: Turnos;

    @ApiProperty({
        description: 'ID da Disciplina (MySQL) vinculada',
        example: 1
    })
    @IsNumber()
    disciplinaId!: number;

    @ApiProperty({
        description: 'ID do Período Letivo (MySQL) vigente',
        example: 1
    })
    @IsNumber()
    periodoId!: number;

    @ApiProperty({
        description: 'ID do Docente (MySQL) responsável pela turma',
        example: 1
    })
    @IsNumber()
    docenteId!: number;

}