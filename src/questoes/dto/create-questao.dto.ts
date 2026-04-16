import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  IsString as IsStringEach,
} from 'class-validator';

import { TipoQuestao } from '../entities/questao.entity';

export class CreateQuestaoDto {
  @IsString()
  pesquisaId!: string;

  @IsString()
  pergunta!: string;

  @IsEnum(TipoQuestao)
  tipo!: TipoQuestao;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  opcoes?: string[];

  @IsOptional()
  @IsNumber()
  escalaMax?: number;
}