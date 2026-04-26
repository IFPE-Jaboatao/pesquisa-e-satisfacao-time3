import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe, // Adicionado para validar o turmaId
} from '@nestjs/common';

import { PesquisasService } from './pesquisas.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/users/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('pesquisas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PesquisasController {
  constructor(private readonly service: PesquisasService) {}

  // --------------------------------
  // OPERAÇÕES DE CONSULTA (Leitura)
  // --------------------------------

  @Get()
  @Roles(Role.GESTOR, Role.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  /**
   * NOVA ROTA: Listar pesquisas por Turma (Escopo MySQL)
   * Alunos precisam desta rota para ver as pesquisas vinculadas à sua turma.
   */
  @Get('turma/:turmaId')
  @Roles(Role.ALUNO, Role.GESTOR, Role.ADMIN)
  findByTurma(@Param('turmaId', ParseIntPipe) turmaId: number) {
    return this.service.findAllByTurma(turmaId);
  }

  @Get(':id')
  @Roles(Role.ALUNO, Role.GESTOR, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/relatorio')
  @Roles(Role.GESTOR, Role.ADMIN)
  getRelatorio(@Param('id') id: string) {
    return this.service.getRelatorio(id);
  }

  // ------------------------------------
  // OPERAÇÕES DE ESCRITA (Com Auditoria)
  // ------------------------------------

  @Post()
  @Roles(Role.GESTOR, Role.ADMIN)
  create(@Body() dto: CreatePesquisaDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(Role.GESTOR, Role.ADMIN)
  update(
    @Param('id') id: string, 
    @Body() dto: Partial<CreatePesquisaDto>,
    @Req() req: any 
  ) {
    return this.service.update(id, dto, req.user);
  }

  @Patch(':id/publicar')
  @Roles(Role.GESTOR, Role.ADMIN)
  publicar(@Param('id') id: string, @Req() req: any) {
    return this.service.publicar(id, req.user);
  }

  // -------------------------------------------------------------------------
  // OPERAÇÕES DE EXCLUSÃO
  // -------------------------------------------------------------------------

  @Delete(':id')
  @Roles(Role.GESTOR, Role.ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(id, req.user);
  }
}