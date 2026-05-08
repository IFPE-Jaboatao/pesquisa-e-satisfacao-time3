import { IsEnum, IsNumber, IsString, MinLength } from "class-validator";
import { Turnos } from "../turma-turnos.enum";

export class CreateTurmaDto {

    @IsEnum(Turnos)
    turno!: Turnos;

    @IsNumber()
    disciplinaId!: number

    @IsNumber()
    periodoId!: number

    @IsNumber()
    docenteId!: number

}
