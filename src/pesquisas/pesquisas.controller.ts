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
// IMPORTAÇÕES DO SWAGGER
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Pesquisas') // Organiza na categoria "Pesquisas"
@ApiBearerAuth('JWT-auth') // Ativa o cadeado para o Token JWT
@Controller('pesquisas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PesquisasController {
  constructor(private readonly service: PesquisasService) {}

  // --- CONSULTA ---

  @ApiOperation({ summary: 'Listar todas as pesquisas (Gestor/Admin)' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  @Get()
  @Roles(Role.GESTOR, Role.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Listar pesquisas de uma turma específica' })
  @ApiParam({ name: 'turmaId', description: 'ID numérico da turma (MySQL)' })
  @Get('turma/:turmaId')
  @Roles(Role.ALUNO, Role.GESTOR, Role.ADMIN)
  findByTurma(@Param('turmaId', ParseIntPipe) turmaId: number) {
    return this.service.findAllByTurma(turmaId);
  }

  @ApiOperation({ summary: 'Buscar uma pesquisa específica pelo ID do MongoDB' })
  @ApiParam({ name: 'id', description: 'ID da pesquisa (HexString do MongoDB)' })
  @Get(':id')
  @Roles(Role.ALUNO, Role.GESTOR, Role.ADMIN)
  findOne(@Param('id') id: string) {
    this.validarObjectId(id);
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Gerar dados de relatório da pesquisa' })
  @Get(':id/relatorio')
  @Roles(Role.GESTOR, Role.ADMIN)
  async getRelatorio(@Param('id') id: string) {
    this.validarObjectId(id);

    // Busca os dados que serão enviados ao RelatoriosService
    const dadosRelatorio = await this.service.getRelatorio(id);

    // LOG DE DEBUG
    console.log('--- DEBUG RELATÓRIO ---');
    console.log('Pesquisa encontrada:', JSON.stringify(dadosRelatorio, null, 2));
    
    return dadosRelatorio;
  }

  // --- ESCRITA ---

  @ApiOperation({ summary: 'Criar uma nova pesquisa (Gestor/Admin)' })
  @ApiResponse({ status: 201, description: 'Pesquisa criada no MongoDB com sucesso.' })
  @Post()
  @Roles(Role.GESTOR, Role.ADMIN)
  create(@Body() dto: CreatePesquisaDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Atualizar dados de uma pesquisa' })
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

  @ApiOperation({ summary: 'Publicar pesquisa para que fique visível aos alunos' })
  @Patch(':id/publicar')
  @Roles(Role.GESTOR, Role.ADMIN)
  async publicar(@Param('id') id: string, @Req() req: any) {
    this.validarObjectId(id);
    return await this.service.publicar(id, req.user);
  }

  @ApiOperation({ summary: 'Remover uma pesquisa do sistema' })
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