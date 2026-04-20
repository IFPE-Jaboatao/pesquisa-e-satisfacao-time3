import { IsNumber, Max, Min } from "class-validator"

export class CreatePeriodoDto {

    @IsNumber()
    @Min(2024)
    ano!: number

    @IsNumber()
    @Min(1)
    @Max(2)
    semestre!: number

}
