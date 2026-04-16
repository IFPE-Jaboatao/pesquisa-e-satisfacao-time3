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

@Controller('questoes')
export class QuestoesController {
  constructor(private readonly service: QuestoesService) {}

  //  ADMIN cria questão
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateQuestaoDto) {
    return this.service.create(dto);
  }

  //  PÚBLICO busca questões da pesquisa
  @Get(':pesquisaId')
  findByPesquisa(@Param('pesquisaId') pesquisaId: string) {
    return this.service.findByPesquisa(pesquisaId);
  }
}