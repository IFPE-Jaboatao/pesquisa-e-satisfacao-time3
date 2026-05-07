import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RespostasService } from './respostas.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { EnviarRespostaDto } from './dto/enviar-resposta.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';
// IMPORTAÇÕES DO SWAGGER
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Respostas') // Categoria no Swagger
@ApiBearerAuth('JWT-auth') // Ativa o cadeado de segurança
@Controller('respostas')
export class RespostasController {
  constructor(private readonly service: RespostasService) {}

  @ApiOperation({ 
    summary: 'Registrar a resposta de um aluno', 
    description: 'Envia as respostas para uma pesquisa específica. Requer token de Aluno, Gestor ou Admin.' 
  })
  @ApiResponse({ status: 201, description: 'Respostas registradas com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado: Token inválido ou ausente.' })
  @ApiResponse({ status: 429, description: 'Muitas requisições: Limite de envio excedido.' })
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.ALUNO, Role.GESTOR, Role.ADMIN)
  @Throttle({ default: { limit: 15, ttl: 60 } })
  @Post('enviar')
  async enviar(
    @Req() req: any, 
    @Body() dto: EnviarRespostaDto
  ) {
    const alunoId = req.user?.id;

    if (!alunoId) {
      throw new UnauthorizedException(
        'Falha na identificação: ID do usuário ausente no token.'
      );
    }

    return this.service.registrarIdentificado(dto, alunoId);
  }

  @ApiOperation({ summary: 'Gerar relatório consolidado de respostas (Gestor/Admin)' })
  @ApiParam({ name: 'pesquisaId', description: 'ID da pesquisa no MongoDB' })
  @ApiResponse({ status: 200, description: 'Dados do relatório retornados com sucesso.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GESTOR, Role.ADMIN)
  @Get('relatorio/:pesquisaId')
  async relatorio(@Param('pesquisaId') pesquisaId: string) {
    return this.service.relatorio(pesquisaId);
  }
}