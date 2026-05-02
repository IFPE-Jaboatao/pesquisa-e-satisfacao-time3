import { IsString, IsDateString, IsNotEmpty, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreatePesquisaDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  titulo!: string;

  @IsDateString({}, { message: 'Data de início inválida.' })
  dataInicio!: string;

  @IsDateString({}, { message: 'Data final inválida.' })
  dataFinal!: string;

  @IsString()
  @IsNotEmpty({ message: 'O tipo da pesquisa (ex: ACADEMICA) é obrigatório.' })
  tipo!: string;

 
  @IsNumber()
  @IsNotEmpty({ message: 'O ID da turma (escopo) é obrigatório.' })
  turmaId!: number;

  @IsBoolean()
  @IsOptional()
  publicada?: boolean;
}