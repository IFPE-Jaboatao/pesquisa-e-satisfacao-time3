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
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';
// IMPORTAÇÕES DO SWAGGER
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Cursos') // Organiza as rotas na seção "Cursos" do Swagger
@ApiBearerAuth('JWT-auth') // Ativa o cadeado de segurança para o Token
@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @ApiOperation({ summary: 'Criar um novo curso (Apenas Admin)' })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Proibido: Sem permissão de Admin.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursoService.create(createCursoDto);
  }

  @ApiOperation({ summary: 'Listar todos os cursos cadastrados' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN, Role.GESTOR)
  findAll() {
    return this.cursoService.findAll();
  }

  @ApiOperation({ summary: 'Buscar um curso específico pelo ID' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.ADMIN, Role.GESTOR)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.cursoService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualizar dados de um curso' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: string, @Body() updateCursoDto: UpdateCursoDto) {
    if (Object.keys(updateCursoDto).length === 0) {
      throw new BadRequestException('Não foram fornecidos dados para atualização.');
    }
    return this.cursoService.update(+id, updateCursoDto);
  }

  @ApiOperation({ summary: 'Remover um curso do sistema' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.cursoService.remove(+id);
  }
}