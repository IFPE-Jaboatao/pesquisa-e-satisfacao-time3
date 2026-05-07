import { 
  IsString, 
  IsDateString, 
  IsNotEmpty, 
  IsNumber, 
  IsBoolean, 
  IsOptional, 
  IsEnum,
  MinLength
} from 'class-validator';
import { Tipo } from '../pesquisa-tipo.enum';
import { IsBefore } from 'src/common/decorators/is-before.decorator';
import { MaxMonthsDiff } from 'src/common/decorators/max-months-diff.decorator';

export class CreateSatisfacaoDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  titulo!: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória.'})
  @MinLength(10, {message: 'A descrição deve ter no minímo 10 caracteres.'})
  descricao!: string

  @IsDateString({}, { message: 'Data de início inválida.' })
  @IsNotEmpty() // Adicionado para permitir que o service use a data atual como padrão
  @IsBefore('dataFinal', {message: 'Data final deve ser depois da data de início.'})
  dataInicio!: string;

  @IsDateString({}, { message: 'Data final inválida.' })
  @IsNotEmpty()
  @MaxMonthsDiff('dataInicio', 1, { message: 'Data final deve ser no minímo 1 mês após a data de início.' })
  dataFinal!: string;

  @IsNumber()
  @IsNotEmpty({ message: 'O ID do serviço é obrigatório.' })
  servicoId!: number;

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