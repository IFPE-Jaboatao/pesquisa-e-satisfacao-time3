import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Delete,
  UseGuards,
  Req, // 1. Adicionado o Req aqui
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

  /**
   * OPERAÇÕES DE CONSULTA (Não precisam de auditoria de escrita)
   */

  @Get()
  @Roles(Role.GESTOR, Role.ADMIN)
  findAll() {
    return this.service.findAll();
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

  /**
   * OPERAÇÕES DE ESCRITA (Agora enviando o usuário para o log)
   */

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
    @Req() req: any // 2. Captura a requisição para pegar o usuário logado
  ) {
    // 3. Passa req.user como o 3º argumento exigido pelo service
    return this.service.update(id, dto, req.user);
  }

  @Patch(':id/publicar')
  @Roles(Role.GESTOR, Role.ADMIN)
  publicar(@Param('id') id: string, @Req() req: any) {
    // Passa req.user como o 2º argumento exigido pelo service
    return this.service.publicar(id, req.user);
  }

  /**
   * OPERAÇÕES DE EXCLUSÃO
   */

  @Delete(':id')
  @Roles(Role.GESTOR, Role.ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    // Passa req.user como o 2º argumento exigido pelo service
    return this.service.remove(id, req.user);
  }
}