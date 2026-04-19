import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RespostasService } from '../respostas/respostas.service';
import { RelatoriosService } from './relatorios.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';

@Controller('relatorios')
export class RelatoriosController {
  constructor(
    private respostasService: RespostasService,
    private relatorioService: RelatoriosService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':pesquisaId')
  @Roles(Role.ADMIN, Role.GESTOR)
  async resumo(@Param('pesquisaId') id: string) {
    const respostas = await this.respostasService.relatorio(id);
    return this.relatorioService.gerarResumo(respostas);
  }
}