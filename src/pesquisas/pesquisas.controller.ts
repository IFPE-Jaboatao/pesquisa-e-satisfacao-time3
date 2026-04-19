import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { PesquisasService } from './pesquisas.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/users/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('pesquisas')
export class PesquisasController {
  constructor(private readonly service: PesquisasService) {}

  // Gestor cria pesquisas
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.GESTOR)
  create(@Body() dto: CreatePesquisaDto) {
    return this.service.create(dto);
  }

  // Gestor lista todas as pesquisas
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.GESTOR)
  findAll() {
    return this.service.findAll();
  }

  // Aluno e gestor acessam a pesquisa específica
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.ALUNO, Role.GESTOR)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // Gestor atualiza a pesquisa se não tiver respostas
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.GESTOR)
  update(@Param('id') id: string, @Body() dto: Partial<CreatePesquisaDto>) {
    return this.service.update(id, dto);
  }

  // Gestor publica pesquisa
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/publicar')
  @Roles(Role.GESTOR)
  publicar(@Param('id') id: string) {
    return this.service.publicar(id);
  }

  // Gestor deleta pesquisa (com cascata no service)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.GESTOR)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}