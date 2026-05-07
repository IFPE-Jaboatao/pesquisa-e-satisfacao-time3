import { 
  IsString, 
  IsDateString, 
  IsNotEmpty, 
  IsNumber, 
  IsBoolean, 
  IsOptional 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePesquisaDto {
  @ApiProperty({
    description: 'Título da pesquisa de satisfação',
    example: 'Avaliação Docente 2026.1 - Campus Recife',
  })
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  titulo!: string;

  @ApiPropertyOptional({
    description: 'Data de início da pesquisa (ISO 8601). Padrão: Data atual.',
    example: '2026-05-07T00:00:00Z',
  })
  @IsDateString({}, { message: 'Data de início inválida.' })
  @IsOptional()
  dataInicio?: string;

  @ApiPropertyOptional({
    description: 'Data de encerramento da pesquisa (ISO 8601).',
    example: '2026-06-07T23:59:59Z',
  })
  @IsDateString({}, { message: 'Data final inválida.' })
  @IsOptional()
  dataFinal?: string;

  @ApiProperty({
    description: 'Tipo da pesquisa para filtragem',
    example: 'ACADEMICA',
  })
  @IsString()
  @IsNotEmpty({ message: 'O tipo da pesquisa (ex: ACADEMICA) é obrigatório.' })
  tipo!: string;

  @ApiProperty({
    description: 'ID da turma à qual a pesquisa está vinculada',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'O ID da turma (escopo) é obrigatório.' })
  turmaId!: number;

  @ApiPropertyOptional({
    description: 'Define se a pesquisa já está visível para os alunos',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  publicada?: boolean;

  @ApiPropertyOptional({
    description: 'Define se a pesquisa foi encerrada para novas respostas',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  finalizada?: boolean;
}