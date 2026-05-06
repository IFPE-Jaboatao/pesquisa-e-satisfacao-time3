import { IsDateString, IsNumber, Max, Min } from "class-validator"
import { IsBefore } from "src/common/decorators/is-before.decorator"
import { IsCompatibleYear } from "src/common/decorators/is-compatible-year.decorator"
import { MaxMonthsDiff } from "src/common/decorators/max-months-diff.decorator"


export class CreatePeriodoDto {

    @IsNumber()
    @Min(2010)
    @Max(new Date().getFullYear() + 1)
    @IsCompatibleYear('startDate')
    ano!: number

    @IsNumber()
    @Min(1)
    @Max(2)
    semestre!: number

    @IsDateString()
    @IsBefore('endDate', { message: 'startDate deve ser anterior a endDate' })
    startDate!: string

    @IsDateString()
    @MaxMonthsDiff('startDate', 7, { message: 'endDate deve ser no máximo 7 meses após startDate' })
    endDate!: string

}
