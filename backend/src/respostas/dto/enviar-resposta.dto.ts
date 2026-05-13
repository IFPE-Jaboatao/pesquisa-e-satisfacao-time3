import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RespostaItemDto {
  @IsString()
  questaoId!: string;

  @IsString()
  valor!: string;
}

export class EnviarRespostaDto {
  @IsString()
  pesquisaId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespostaItemDto)
  respostas!: RespostaItemDto[];
}