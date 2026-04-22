// src/relatorios/relatorios.controller.ts

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PesquisasService } from '../pesquisas/pesquisas.service'; // Importe o serviço atualizado
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';

@Controller('relatorios')
export class RelatoriosController {
  constructor(
    // Injetamos o PesquisasService que contém a lógica de "dadosGrafico"
    private readonly pesquisasService: PesquisasService, 
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':pesquisaId')
  @Roles(Role.ADMIN, Role.GESTOR)
  async resumo(@Param('pesquisaId') id: string) {
    // método o JSON organizado
    return await this.pesquisasService.getRelatorio(id);
  }
}