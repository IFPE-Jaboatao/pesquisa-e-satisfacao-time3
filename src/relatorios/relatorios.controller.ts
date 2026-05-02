import { Controller, Get, Param, UseGuards, Res, HttpStatus, NotFoundException } from '@nestjs/common';
import type { Response } from 'express'; 
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PesquisasService } from '../pesquisas/pesquisas.service';
import { RelatoriosService } from './relatorios.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';

@Controller('relatorios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RelatoriosController {
  constructor(
    private readonly pesquisasService: PesquisasService,
    private readonly relatoriosService: RelatoriosService,
  ) {}

  @Get(':pesquisaId/resumo')
  @Roles(Role.ADMIN, Role.GESTOR)
  async resumo(@Param('pesquisaId') id: string) {
    const dados = await this.pesquisasService.getRelatorio(id);
    if (!dados) throw new NotFoundException('Pesquisa não encontrada');
    return dados;
  }

  @Get(':pesquisaId/csv')
  @Roles(Role.ADMIN, Role.GESTOR)
  async exportarCSV(@Param('pesquisaId') id: string, @Res() res: Response) {
    try {
      const dados = await this.pesquisasService.getRelatorio(id);
      const respostasBrutas = (dados as any)?.respostas || [];
      const csv = await this.relatoriosService.exportarResumoCSV(respostasBrutas);

      res.status(HttpStatus.OK);
      res.header('Content-Type', 'text/csv; charset=utf-8');
      res.attachment(`relatorio-pesquisa-${id}.csv`);
      return res.send(csv);
    } catch (error) {
      // Correção do erro da imagem:
      const msg = error instanceof Error ? error.message : 'Erro interno';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao gerar CSV', error: msg });
    }
  }

  @Get(':pesquisaId/pdf')
  @Roles(Role.ADMIN, Role.GESTOR)
  async exportarPDF(@Param('pesquisaId') id: string, @Res() res: Response) {
    try {
      const dados = await this.pesquisasService.getRelatorio(id);
      const respostasBrutas = (dados as any)?.respostas || [];
      const buffer = await this.relatoriosService.exportarResumoPDF(respostasBrutas);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=relatorio-pesquisa-${id}.pdf`,
        'Content-Length': buffer.length,
      });

      return res.end(buffer);
    } catch (error) {
      // Correção do erro da imagem:
      const msg = error instanceof Error ? error.message : 'Erro interno';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao gerar PDF', error: msg });
    }
  }
}