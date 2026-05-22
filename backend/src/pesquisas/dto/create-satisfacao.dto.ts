import { 
  IsString, 
  IsDateString, 
  IsNotEmpty, 
  IsNumber, 
  IsBoolean, 
  IsOptional, 
  IsEnum,
  MinLength,
  IsArray,
  ArrayMinSize,
  ArrayNotEmpty,
  ValidateNested
} from 'class-validator';
import { Tipo } from '../pesquisa-tipo.enum';
import { IsBefore } from 'src/common/decorators/is-before.decorator';
import { MaxMonthsDiff } from 'src/common/decorators/max-months-diff.decorator';
import { CreateQuestaoDto } from 'src/questoes/dto/create-questao.dto';
import { CreateQuestaoParcialDto } from 'src/questoes/dto/create-questao-parcial.dto';
import { Type } from 'class-transformer';

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
  dataFinal!: string;

  @IsNumber()
  @IsNotEmpty({ message: 'O ID do serviço é obrigatório.' })
  servicoId!: number;

  @IsArray({ message: 'O campo de questões deve ser um array.' })
  @ArrayNotEmpty({ message: "A lista de questões não pode estar vazia." })
  @ArrayMinSize(1, { message: "A pesquisa deve ter pelo menos uma questão." })
  @ValidateNested({each: true, message: 'As questões devem ser objetos válidos.'})
  @Type(() => CreateQuestaoParcialDto)
  questoes!: CreateQuestaoParcialDto[];

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