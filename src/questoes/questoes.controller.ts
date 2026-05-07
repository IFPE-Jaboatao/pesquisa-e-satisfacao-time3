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
// IMPORTAÇÕES DO SWAGGER
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Questões') // Organiza na categoria "Questões" no Swagger
@ApiBearerAuth('JWT-auth') // Habilita o uso do Token JWT na interface
@Controller('questoes')
export class QuestoesController {
  constructor(private readonly service: QuestoesService) {}

  @ApiOperation({ summary: 'Criar uma nova questão para uma pesquisa (Admin/Gestor)' })
  @ApiResponse({ status: 201, description: 'Questão vinculada à pesquisa com sucesso.' })
  @ApiResponse({ status: 403, description: 'Proibido: Usuário sem permissão de Gestor/Admin.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN, Role.GESTOR) 
  create(@Body() dto: CreateQuestaoDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Listar todas as questões de uma pesquisa específica' })
  @ApiParam({ name: 'pesquisaId', description: 'ID da pesquisa no MongoDB (HexString)' })
  @ApiResponse({ status: 200, description: 'Lista de questões retornada com sucesso.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('pesquisa/:pesquisaId')
  @Roles(Role.ADMIN, Role.GESTOR, Role.ALUNO)
  findByPesquisa(@Param('pesquisaId') pesquisaId: string) {
    return this.service.findByPesquisa(pesquisaId);
  }
}