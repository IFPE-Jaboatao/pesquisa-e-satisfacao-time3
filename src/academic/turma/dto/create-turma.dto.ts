import { IsNumber } from "class-validator";

export class CreateTurmaDto {

    @IsNumber()
    disciplinaId!: number

    @IsNumber()
    periodoId!: number

    @IsNumber()
    docenteId!: number

}
