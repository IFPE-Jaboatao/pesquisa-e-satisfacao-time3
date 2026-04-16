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

@Controller('pesquisas')
export class PesquisasController {
  constructor(private readonly service: PesquisasService) {}

  // ADMIN cria pesquisa
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePesquisaDto) {
    return this.service.create(dto);
  }

  // ADMIN lista todas as pesquisas
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // PÚBLICO acessa pesquisa específica
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  //  NOVA ROTA: ADMIN atualiza estrutura da pesquisa
  // Só funciona se a pesquisa não estiver publicada (validação feita no Service)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreatePesquisaDto>) {
    return this.service.update(id, dto);
  }

  // ADMIN publica pesquisa
  @UseGuards(JwtAuthGuard)
  @Patch(':id/publicar')
  publicar(@Param('id') id: string) {
    return this.service.publicar(id);
  }

  // ADMIN deleta pesquisa (com cascata no service)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}