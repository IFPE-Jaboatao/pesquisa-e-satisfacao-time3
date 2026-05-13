import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  IsString as IsStringEach,
  ArrayMinSize,
  ArrayNotEmpty,
  ValidateIf,
  Min,
} from 'class-validator';

import { TipoQuestao } from '../entities/questao.entity';

export class CreateQuestaoDto {
  @IsString()
  pesquisaId!: string;

  @IsString()
  pergunta!: string;

  @IsEnum(TipoQuestao)
  tipo!: TipoQuestao;

  @ValidateIf(o => o.tipo === TipoQuestao.MULTIPLA)
  @IsArray({ message: 'A lista de opções deve ser um array.' })
  @ArrayNotEmpty({ message: 'As opções não pode estar vazia!'})
  @ArrayMinSize(2, { message: 'As opções devem ser no mínimo 2.'})
  @IsString({ each: true })
  opcoes?: string[];

  @ValidateIf(o => o.tipo === TipoQuestao.ESCALA)
  @IsNumber({}, { message: 'escalaMax deve ser um número.'})
  @Min(3, { message: 'A escala miníma permitida é 3.'})
  escalaMax?: number;
}