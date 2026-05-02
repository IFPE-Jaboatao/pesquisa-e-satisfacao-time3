import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/user-role.enum';

@Controller('auditoria')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get(':id')
  @Roles(Role.ADMIN) // Apenas administradores podem ver o rastro de auditoria
  async obterHistorico(@Param('id') id: string) {
    return await this.auditoriaService.listarPorEntidade(id);
  }
}