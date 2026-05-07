import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  BadRequestException, 
  ParseIntPipe 
} from '@nestjs/common';
import { PeriodoService } from './periodo.service';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';
// IMPORTAÇÕES DO SWAGGER
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Periodo') // Organiza as rotas na seção "Periodo" do Swagger
@ApiBearerAuth('JWT-auth') // Ativa o cadeado de segurança para o token JWT
@Controller('periodo')
export class PeriodoController {
  constructor(private readonly periodoService: PeriodoService) {}

  @ApiOperation({ summary: 'Criar um novo período letivo (Apenas Admin)' })
  @ApiResponse({ status: 201, description: 'Período criado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Proibido: Sem permissão de Admin.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createPeriodoDto: CreatePeriodoDto) {
    return this.periodoService.create(createPeriodoDto);
  }

  @ApiOperation({ summary: 'Listar todos os períodos cadastrados (Apenas Admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.periodoService.findAll();
  }

  @ApiOperation({ summary: 'Buscar um período específico pelo ID (Apenas Admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.periodoService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualizar dados de um período' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: string, @Body() updatePeriodoDto: UpdatePeriodoDto) {
    if (Object.keys(updatePeriodoDto).length === 0) {
      throw new BadRequestException("Não foram fornecidos dados para atualização!");
    }

    return this.periodoService.update(+id, updatePeriodoDto);
  }

  @ApiOperation({ summary: 'Deletar um período do sistema' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.periodoService.remove(+id);
  }
}