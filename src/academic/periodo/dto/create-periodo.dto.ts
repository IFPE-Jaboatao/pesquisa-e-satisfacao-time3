import { IsDateString, IsNumber, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"; // Importação necessária
import { IsBefore } from "src/common/decorators/is-before.decorator";
import { IsCompatibleYear } from "src/common/decorators/is-compatible-year.decorator";
import { MaxMonthsDiff } from "src/common/decorators/max-months-diff.decorator";

export class CreatePeriodoDto {

    @ApiProperty({
        description: 'Ano do período letivo',
        example: 2026,
        minimum: 2010,
        maximum: new Date().getFullYear() + 1
    })
    @IsNumber()
    @Min(2010)
    @Max(new Date().getFullYear() + 1)
    @IsCompatibleYear('startDate')
    ano!: number;

    @ApiProperty({
        description: 'Semestre do período (1 ou 2)',
        example: 1,
        minimum: 1,
        maximum: 2
    })
    @IsNumber()
    @Min(1)
    @Max(2)
    semestre!: number;

    @ApiProperty({
        description: 'Data de início do período letivo (ISO 8601)',
        example: '2026-02-01T00:00:00Z'
    })
    @IsDateString()
    @IsBefore('endDate', { message: 'startDate deve ser anterior a endDate' })
    startDate!: string;

    @ApiProperty({
        description: 'Data de término do período letivo (máximo 7 meses após o início)',
        example: '2026-06-30T23:59:59Z'
    })
    @IsDateString()
    @MaxMonthsDiff('startDate', 7, { message: 'endDate deve ser no máximo 7 meses após startDate' })
    endDate!: string;

}