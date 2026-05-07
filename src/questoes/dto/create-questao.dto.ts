import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoQuestao } from '../entities/questao.entity';

export class CreateQuestaoDto {
  @ApiProperty({
    description: 'ID da Pesquisa (MongoDB HexString) à qual esta questão pertence',
    example: '66396e9c1d2e3b4a5c6d7e8f',
  })
  @IsString()
  pesquisaId!: string;

  @ApiProperty({
    description: 'O texto da pergunta que será exibido ao usuário',
    example: 'Como você avalia a infraestrutura do campus?',
  })
  @IsString()
  pergunta!: string;

  @ApiProperty({
    description: 'Tipo da questão (TEXTO, MULTIPLA_ESCOLHA, ESCALA)',
    enum: TipoQuestao,
    example: 'MULTIPLA_ESCOLHA', // Usando string direta para evitar erro de tipo
  })
  @IsEnum(TipoQuestao)
  tipo!: TipoQuestao;

  @ApiPropertyOptional({
    description: 'Lista de opções (obrigatório para MULTIPLA_ESCOLHA)',
    example: ['Ótimo', 'Bom', 'Regular', 'Ruim'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  opcoes?: string[];

  @ApiPropertyOptional({
    description: 'Valor máximo para questões do tipo ESCALA (ex: 5 ou 10)',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  escalaMax?: number;
}