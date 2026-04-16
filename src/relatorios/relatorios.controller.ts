import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RespostasService } from '../respostas/respostas.service';
import { RelatoriosService } from './relatorios.service';

@Controller('relatorios')
export class RelatoriosController {
  constructor(
    private respostasService: RespostasService,
    private relatorioService: RelatoriosService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':pesquisaId')
  async resumo(@Param('pesquisaId') id: string) {
    const respostas = await this.respostasService.relatorio(id);
    return this.relatorioService.gerarResumo(respostas);
  }
}