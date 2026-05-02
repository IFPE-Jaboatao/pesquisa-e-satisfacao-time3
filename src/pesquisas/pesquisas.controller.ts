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
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';

import { PesquisasService } from './pesquisas.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/users/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ObjectId } from 'mongodb';

@Controller('pesquisas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PesquisasController {
  constructor(private readonly service: PesquisasService) {}

  // --- CONSULTA ---

  @Get()
  @Roles(Role.GESTOR, Role.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  @Get('turma/:turmaId')
  @Roles(Role.ALUNO, Role.GESTOR, Role.ADMIN)
  findByTurma(@Param('turmaId', ParseIntPipe) turmaId: number) {
    return this.service.findAllByTurma(turmaId);
  }

  @Get(':id')
  @Roles(Role.ALUNO, Role.GESTOR, Role.ADMIN)
  findOne(@Param('id') id: string) {
    this.validarObjectId(id);
    return this.service.findOne(id);
  }

  @Get(':id/relatorio')
  @Roles(Role.GESTOR, Role.ADMIN)
  getRelatorio(@Param('id') id: string) {
    this.validarObjectId(id);
    return this.service.getRelatorio(id);
  }

  // --- ESCRITA ---

  @Post()
  @Roles(Role.GESTOR, Role.ADMIN)
  create(@Body() dto: CreatePesquisaDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(Role.GESTOR, Role.ADMIN)
  async update(
    @Param('id') id: string, 
    @Body() dto: Partial<CreatePesquisaDto>,
    @Req() req: any 
  ) {
    this.validarObjectId(id);
    // Garante que req.user existe para evitar erro de undefined no Service
    const usuario = req.user || { userId: 'sistema' };
    return await this.service.update(id, dto, usuario);
  }

  @Patch(':id/publicar')
  @Roles(Role.GESTOR, Role.ADMIN)
  async publicar(@Param('id') id: string, @Req() req: any) {
    this.validarObjectId(id);
    return await this.service.publicar(id, req.user);
  }

  @Delete(':id')
  @Roles(Role.GESTOR, Role.ADMIN)
  async remove(@Param('id') id: string, @Req() req: any) {
    this.validarObjectId(id);
    return await this.service.remove(id, req.user);
  }

  // Método auxiliar para evitar que IDs inválidos cheguem ao Service
  private validarObjectId(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Formato de ID MongoDB inválido.');
    }
  }
}