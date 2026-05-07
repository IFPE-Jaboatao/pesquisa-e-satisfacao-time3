import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger'; // Importação do Swagger

class RespostaItemDto {
  @ApiProperty({
    description: 'ID da Questão (MongoDB HexString)',
    example: '66396e9c1d2e3b4a5c6d7e8f',
  })
  @IsString()
  questaoId!: string;

  @ApiProperty({
    description: 'Valor da resposta (pode ser o texto, opção escolhida ou número da escala)',
    example: 'Ótimo',
  })
  @IsString()
  valor!: string;
}

export class EnviarRespostaDto {
  @ApiProperty({
    description: 'ID da Pesquisa (MongoDB HexString) que está sendo respondida',
    example: '66396e9c1d2e3b4a5c6d7e8f',
  })
  @IsString()
  pesquisaId!: string;

  @ApiProperty({
    description: 'Lista contendo as respostas para cada questão',
    type: [RespostaItemDto], // Indica que é um array deste DTO
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespostaItemDto)
  respostas!: RespostaItemDto[];
}