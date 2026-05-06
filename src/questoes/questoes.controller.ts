import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { QuestoesService } from './questoes.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateQuestaoDto } from './dto/create-questao.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/users/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('questoes')
export class QuestoesController {
  constructor(private readonly service: QuestoesService) {}

  /**
   * CRIAÇÃO DE QUESTÕES
   * Liberado para ADMIN e GESTOR para evitar o erro 403 que você recebeu.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN, Role.GESTOR) 
  create(@Body() dto: CreateQuestaoDto, @Req() req: any) {
    // Passamos o req.user para o service para disparar o e-mail de auditoria
    return this.service.create(dto, req.user);
  }

  /**
   * BUSCA DE QUESTÕES POR PESQUISA
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('pesquisa/:pesquisaId')
  @Roles(Role.ADMIN, Role.GESTOR, Role.ALUNO)
  findByPesquisa(@Param('pesquisaId') pesquisaId: string) {
    return this.service.findByPesquisa(pesquisaId);
  }
}