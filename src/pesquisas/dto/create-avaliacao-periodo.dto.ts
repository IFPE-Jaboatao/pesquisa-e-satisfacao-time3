import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsBefore } from 'src/common/decorators/is-before.decorator';

export class CreateAvaliacaoPeriodoDto {

    @IsNumber()
    @IsNotEmpty()
    periodoId!: number

    @IsNumber()
    @IsNotEmpty()
    cursoId!: number

    @IsDateString()
    @IsOptional()
    dataInicio?: string

}