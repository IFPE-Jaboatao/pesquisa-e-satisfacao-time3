import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { QuestoesService } from './questoes.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateQuestaoDto } from './dto/create-questao.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/users/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('questoes')
export class QuestoesController {
  constructor(private readonly service: QuestoesService) {}

  // Gestor cria questão
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.GESTOR)
  create(@Body() dto: CreateQuestaoDto) {
    return this.service.create(dto);
  }

  // Aluno e gestor buscam questões da pesquisa
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':pesquisaId')
  @Roles(Role.GESTOR, Role.ALUNO)
  findByPesquisa(@Param('pesquisaId') pesquisaId: string) {
    return this.service.findByPesquisa(pesquisaId);
  }
}