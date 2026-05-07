import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  ParseIntPipe, 
  BadRequestException 
} from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';
// IMPORTAÇÕES DO SWAGGER
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Matrículas') // Organiza as rotas na seção "Matrículas" do Swagger
@ApiBearerAuth('JWT-auth') // Ativa o cadeado de segurança para o Token
@Controller('matricula')
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @ApiOperation({ summary: 'Realizar matrícula de um aluno em uma turma (Apenas Admin/Gestor)' })
  @ApiResponse({ status: 201, description: 'Matrícula realizada com sucesso.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN, Role.GESTOR)
  create(@Body() createMatriculaDto: CreateMatriculaDto) {
    return this.matriculaService.create(createMatriculaDto);
  }

  @ApiOperation({ summary: 'Listar todas as matrículas cadastradas' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN, Role.GESTOR)
  findAll() {
    return this.matriculaService.findAll();
  }

  @ApiOperation({ summary: 'Buscar uma matrícula específica pelo ID' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.ADMIN, Role.GESTOR)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.matriculaService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualizar dados de uma matrícula' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN, Role.GESTOR)
  update(@Param('id', ParseIntPipe) id: string, @Body() updateMatriculaDto: UpdateMatriculaDto) {
    if (Object.keys(updateMatriculaDto).length === 0) {
      throw new BadRequestException('Não foram fornecidos dados para atualização.');
    }
    return this.matriculaService.update(+id, updateMatriculaDto);
  }

  @ApiOperation({ summary: 'Remover ou cancelar uma matrícula' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.matriculaService.remove(+id);
  }
}