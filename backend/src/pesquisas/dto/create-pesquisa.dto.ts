import { 
  IsString, 
  IsDateString, 
  IsNotEmpty, 
  IsNumber, 
  IsBoolean, 
  IsOptional, 
  IsEnum
} from 'class-validator';
import { Tipo } from '../pesquisa-tipo.enum';
import { IsBefore } from 'src/common/decorators/is-before.decorator';
import { Status } from '../pesquisa-status.enum';

export class CreatePesquisaDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  titulo!: string;

  @IsDateString({}, { message: 'Data de início inválida.' })
  @IsOptional() // Adicionado para permitir que o service use a data atual como padrão
  @IsBefore('dataFinal', {message: 'Data final deve ser depois da data de início.'})
  dataInicio?: string;

  @IsDateString({}, { message: 'Data final inválida.' })
  @IsOptional() // Importante para atualizações parciais via PATCH
  dataFinal?: string;
  
  @IsEnum(Tipo)
  @IsNotEmpty()
  tipo!: Tipo;

  @IsNumber()
  @IsNotEmpty({ message: 'O ID da turma (escopo) é obrigatório.' })
  tipoId!: number;

  @IsBoolean()
  @IsOptional()
  publicada?: boolean;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
  /**
   * NOVO: Adicionado para resolver o erro TS2339 no PesquisasService.
   * Permite marcar a pesquisa como encerrada sem removê-la do banco.
   */
  @IsBoolean()
  @IsOptional()
  finalizada?: boolean;
}