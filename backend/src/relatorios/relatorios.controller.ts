import { 
  Controller, 
  Get, 
  Param, 
  UseGuards, 
  Res, 
  HttpStatus, 
  NotFoundException, 
  Req
} from '@nestjs/common';
import type { Response } from 'express'; 
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PesquisasService } from '../pesquisas/pesquisas.service';
import { RelatoriosService } from './relatorios.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/user-role.enum';

// Ajustado para manter a consistência com a rota raiz de pesquisas requisitada
@Controller('surveys/pesquisas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RelatoriosController {
  constructor(
    private readonly pesquisasService: PesquisasService,
    private readonly relatoriosService: RelatoriosService,
  ) {}

  /**
   * Retorna os dados em JSON para gráficos ou conferência rápida
   */
  @Get(':pesquisaId/relatorio')
  @Roles(Role.ADMIN, Role.GESTOR)
  async resumo(@Param('pesquisaId') id: string) {
    const dados = await this.pesquisasService.getRelatorio(id);
    if (!dados) throw new NotFoundException('Pesquisa não encontrada');
    
    return dados;
  }

  @Get(':pesquisaId/relatorio/docente')
  @Roles(Role.DOCENTE, Role.GESTOR)
  async relatorioDocente(@Param('pesquisaId') id: string, @Req() req) {
    return await this.pesquisasService.getRelatorioAvaliacao(id, req.user);
  }

  /**
   * Exportação em CSV
   */
  @Get(':pesquisaId/relatorio/csv')
  @Roles(Role.ADMIN, Role.GESTOR)
  async exportarCSV(@Param('pesquisaId') id: string, @Res() res: Response) {
    try {
      const { pesquisa, respostas } = await this.pesquisasService.getRelatorio(id);
      const csv = await this.relatoriosService.exportarResumoCSV(pesquisa, respostas);

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=relatorio-${id}.csv`);
      
      return res.status(HttpStatus.OK).send(csv);
    } catch (error) {
      console.error('[ERRO FATAL CSV]:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        statusCode: 500,
        message: 'Erro ao gerar exportação CSV', 
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Exportação em PDF
   */
  @Get(':pesquisaId/relatorio/pdf')
  @Roles(Role.ADMIN, Role.GESTOR)
  async exportarPDF(@Param('pesquisaId') id: string, @Res() res: Response) {
    try {
      const { pesquisa, respostas } = await this.pesquisasService.getRelatorio(id);

      const buffer = await this.relatoriosService.exportarResumoPDF(pesquisa, respostas);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=relatorio-${id}.pdf`,
        'Content-Length': buffer.length,
        'Cache-Control': 'no-cache',
      });

      return res.status(HttpStatus.OK).end(buffer);
    } catch (error) {
      console.error('[ERRO FATAL PDF]:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        statusCode: 500,
        message: 'Erro ao gerar exportação PDF', 
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}