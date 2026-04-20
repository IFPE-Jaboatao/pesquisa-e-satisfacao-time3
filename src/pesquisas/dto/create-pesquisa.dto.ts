import { IsString, IsDateString } from 'class-validator';

export class CreatePesquisaDto {
  @IsString()
  titulo!: string;

  @IsDateString()
  dataInicio!: string;

  @IsDateString()
  dataFinal!: string;

  @IsString()
  tipo!: string;
}