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

@Controller('respostas')
export class RespostasController {
  constructor(private readonly service: RespostasService) {}

  /**
   * Registra a resposta de um aluno.
   * Agora com RolesGuard para garantir que apenas 'alunos' (ou gestores/admin) respondam.
   */
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.ALUNO, Role.GESTOR, Role.ADMIN) // Adicionado Role.ALUNO para evitar Acesso Negado
  @Throttle({ default: { limit: 15, ttl: 60 } })
  @Post('enviar')
  async enviar(
    @Req() req: any, 
    @Body() dto: EnviarRespostaDto
  ) {
    // Verificamos se o usuário existe no request (preenchido pelo JwtAuthGuard)
    if (!req.user) {
      throw new UnauthorizedException(
        'Falha na identificação: Usuário não autenticado.'
      );
    }

    // Passamos o objeto req.user completo para o service.
    // Isso permite que o service extraia o ID para o banco e o Nome para o e-mail.
    return this.service.registrarIdentificado(dto, req.user);
  }

  /**
   * Rota de relatório restrita apenas a cargos de gestão.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GESTOR, Role.ADMIN)
  @Get('relatorio/:pesquisaId')
  async relatorio(@Param('pesquisaId') pesquisaId: string) {
    return this.service.relatorio(pesquisaId);
  }
}