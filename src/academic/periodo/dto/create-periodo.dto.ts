import { IsNumber, Max, Min } from "class-validator"

export class CreatePeriodoDto {

    @IsNumber()
    @Min(2010)
    @Max(new Date().getFullYear() + 1)
    ano!: number

    @IsNumber()
    @Min(1)
    @Max(2)
    semestre!: number

}
