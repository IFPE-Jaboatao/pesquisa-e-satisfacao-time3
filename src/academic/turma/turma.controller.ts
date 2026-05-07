import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards, 
  ParseIntPipe, 
  BadRequestException 
} from '@nestjs/common';
import { TurmaService } from './turma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';
// IMPORTAÇÕES DO SWAGGER
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Turmas')
@ApiBearerAuth('JWT-auth')
@Controller('turma')
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  @ApiOperation({ summary: 'Criar uma nova turma (Apenas Admin)' })
  @ApiResponse({ status: 201, description: 'Turma criada com sucesso.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createTurmaDto: CreateTurmaDto) {
    return this.turmaService.create(createTurmaDto);
  }

  @ApiOperation({ summary: 'Listar todas as turmas cadastradas' })
  @ApiQuery({ name: 'disciplinaId', required: false, description: 'Filtrar turmas por ID da disciplina' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN)
  findAll(@Query('disciplinaId') disciplinaId?: string) {
    return this.turmaService.findAll(disciplinaId ? +disciplinaId : undefined);
  }

  @ApiOperation({ summary: 'Listar turmas vinculadas a um docente específico' })
  @ApiParam({ name: 'id', description: 'ID do Docente (MySQL)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/docente/:id')
  @Roles(Role.ADMIN, Role.DOCENTE)
  findAllProfessor(@Param('id', ParseIntPipe) docenteId: string) {
    return this.turmaService.findAllProfessor(+docenteId);
  }

  @ApiOperation({ summary: 'Buscar uma turma específica pelo ID' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.turmaService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualizar dados de uma turma' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: string, @Body() updateTurmaDto: UpdateTurmaDto) {
    if (Object.keys(updateTurmaDto).length === 0) {
      throw new BadRequestException('Não foram fornecidos dados para atualização.');
    }

    return this.turmaService.update(+id, updateTurmaDto);
  }

  @ApiOperation({ summary: 'Remover uma turma do sistema' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.turmaService.remove(+id);
  }
}