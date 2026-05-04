import { 
  IsString, 
  IsDateString, 
  IsNotEmpty, 
  IsNumber, 
  IsBoolean, 
  IsOptional 
} from 'class-validator';

export class CreatePesquisaDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  titulo!: string;

  @IsDateString({}, { message: 'Data de início inválida.' })
  @IsOptional() // Adicionado para permitir que o service use a data atual como padrão
  dataInicio?: string;

  @IsDateString({}, { message: 'Data final inválida.' })
  @IsOptional() // Importante para atualizações parciais via PATCH
  dataFinal?: string;

  @IsString()
  @IsNotEmpty({ message: 'O tipo da pesquisa (ex: ACADEMICA) é obrigatório.' })
  tipo!: string;

  @IsNumber()
  @IsNotEmpty({ message: 'O ID da turma (escopo) é obrigatório.' })
  turmaId!: number;

  @IsBoolean()
  @IsOptional()
  publicada?: boolean;

  /**
   * NOVO: Adicionado para resolver o erro TS2339 no PesquisasService.
   * Permite marcar a pesquisa como encerrada sem removê-la do banco.
   */
  @IsBoolean()
  @IsOptional()
  finalizada?: boolean;
}