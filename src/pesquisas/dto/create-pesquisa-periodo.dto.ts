import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsBefore } from 'src/common/decorators/is-before.decorator';

export class CreatePesquisaPeriodoDto {

    @IsNumber()
    @IsNotEmpty()
    periodoId!: number

}