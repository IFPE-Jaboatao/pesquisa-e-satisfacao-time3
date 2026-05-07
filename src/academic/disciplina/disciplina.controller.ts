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
import { DisciplinaService } from './disciplina.service';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';
// IMPORTAÇÕES DO SWAGGER
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Disciplinas') // Organiza as rotas na seção "Disciplinas" do Swagger
@ApiBearerAuth('JWT-auth') // Ativa o cadeado de segurança para o Token
@Controller('disciplina')
export class DisciplinaController {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  @ApiOperation({ summary: 'Criar uma nova disciplina (Apenas Admin)' })
  @ApiResponse({ status: 201, description: 'Disciplina criada com sucesso.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createDisciplinaDto: CreateDisciplinaDto) {
    return this.disciplinaService.create(createDisciplinaDto);
  }

  @ApiOperation({ summary: 'Listar todas as disciplinas cadastradas' })
  @ApiQuery({ name: 'cursoId', required: false, description: 'Filtrar disciplinas por ID do curso' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN, Role.GESTOR)
  findAll(@Query('cursoId') cursoId?: string) {
    return this.disciplinaService.findAll(cursoId ? +cursoId : undefined);
  }

  @ApiOperation({ summary: 'Buscar uma disciplina específica pelo ID' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.ADMIN, Role.GESTOR)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.disciplinaService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualizar dados de uma disciplina' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: string, @Body() updateDisciplinaDto: UpdateDisciplinaDto) {
    if (Object.keys(updateDisciplinaDto).length === 0) {
      throw new BadRequestException('Não foram fornecidos dados para atualização.');
    }

    return this.disciplinaService.update(+id, updateDisciplinaDto);
  }

  @ApiOperation({ summary: 'Remover uma disciplina do sistema' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.disciplinaService.remove(+id);
  }
}