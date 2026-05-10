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
  Res,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { PesquisasService } from './pesquisas.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/users/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ObjectId } from 'mongodb';
import { CreateAvaliacaoPeriodoDto } from './dto/create-avaliacao-periodo.dto';
import { CreateSatisfacaoDto } from './dto/create-satisfacao.dto';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';

@Controller('surveys/pesquisas')
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

  @Get('avaliacao/criterios')
  @Roles(Role.ALUNO, Role.GESTOR, Role.ADMIN)
  async getPreviewAvaliacaoDocente() {
    return this.service.getPreviewAvaliacaoDocente();
  }

  @Get(':id')
  @Roles(Role.ALUNO, Role.GESTOR, Role.ADMIN)
  findOne(@Param('id') id: string) {
    this.validarObjectId(id);
    return this.service.findOne(id);
  }

  /**
   * Endpoint de Relatório corrigido com log de auditoria para debugar o erro "Ref:"
   */
  @Get(':id/relatorio')
  @Roles(Role.GESTOR, Role.ADMIN)
  async getRelatorio(@Param('id') id: string) {
    this.validarObjectId(id);

    // Busca os dados que serão enviados ao RelatoriosService
    const dadosRelatorio = await this.service.getRelatorio(id);

    // LOG DE DEBUG: Verifique no terminal se 'questoes' está preenchido e com o campo 'pergunta'
    console.log('--- DEBUG RELATÓRIO ---');
    console.log('Pesquisa encontrada:', JSON.stringify(dadosRelatorio, null, 2));
    
    return dadosRelatorio;
  }

  // --- ESCRITA ---

  /**
   * RN 9.1: Criação de Pesquisa de Satisfação (Manual/Serviço)
   * 
   */
  @Post('/satisfacao')
  @Roles(Role.GESTOR, Role.ADMIN)
  async createSatisfacao(@Body() dto: CreateSatisfacaoDto, @Req() req) {
    // // campo para implementar auditoria futuramente
    // const usuario = req.user;
    return await this.service.createSatisfacao(dto, req.user.campusId); // Redireciona para a lógica que ela vai ajustar
  }

  /**
   * RN 9.2: Criação de Avaliação Docente (Automática/Turma)
   * 
   */
  @Post('avaliacao')
  @Roles(Role.GESTOR, Role.ADMIN)
  async createAvaliacao(@Body() dto: CreateAvaliacaoDto) {
    // // campo para implementar auditoria futuramente
    // const usuario = req.user;
    return this.service.createAvaliacao(dto); // Redireciona para a lógica que ela vai ajustar
  }

  @Post()
  @Roles(Role.GESTOR, Role.ADMIN)
  async create(@Body() dto: CreatePesquisaDto, @Req() req: any) {
    // Captura o usuário da requisição para alimentar a auditoria
    const usuario = req.user;
    return await this.service.create(dto, usuario);
  }

  @Post('/avaliacao/periodo')
  @Roles(Role.GESTOR, Role.ADMIN)
  createAvaliacaoPeriodo(@Body() dto: CreateAvaliacaoPeriodoDto) {
    return this.service.createAvaliacaoPeriodo(dto);
  }

  @Patch(':id')
  @Roles(Role.GESTOR, Role.ADMIN)
  async update(
    @Param('id') id: string, 
    @Body() dto: Partial<CreatePesquisaDto>,
    @Req() req: any 
  ) {
    this.validarObjectId(id);
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

  // --- AUXILIARES ---

  private validarObjectId(id: string) {
    if (!id || !ObjectId.isValid(id)) {
      throw new BadRequestException('Formato de ID MongoDB inválido.');
    }
  }
}