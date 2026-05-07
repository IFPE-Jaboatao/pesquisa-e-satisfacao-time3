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
import { CampusService } from './campus.service';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';
// IMPORTAÇÕES DO SWAGGER
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Campus') // Organiza as rotas na seção "Campus" do Swagger
@ApiBearerAuth('JWT-auth') // Ativa o cadeado de segurança (Authorize)
@Controller('campus')
export class CampusController {
  constructor(private readonly campusService: CampusService) {}

  @ApiOperation({ summary: 'Criar um novo campus (Apenas Admin)' })
  @ApiResponse({ status: 201, description: 'Campus criado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Proibido: Sem permissão de Admin.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createCampusDto: CreateCampusDto) {
    return this.campusService.create(createCampusDto);
  }

  @ApiOperation({ summary: 'Listar todos os campi ativos (Apenas Admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.campusService.findAll();
  }

  @ApiOperation({ summary: 'Listar todos os campi excluídos (Apenas Admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/deleted')
  @Roles(Role.ADMIN)
  findAllDeleted() {
    return this.campusService.findAllDeleted();
  }

  @ApiOperation({ summary: 'Buscar um campus específico pelo ID' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.campusService.findOne(+id);
  }

  @ApiOperation({ summary: 'Buscar campus com todas as relações detalhadas' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/full')
  @Roles(Role.ADMIN)
  findOneFull(@Param('id', ParseIntPipe) id: string) {
    return this.campusService.findOneFull(+id);
  }

  @ApiOperation({ summary: 'Atualizar dados de um campus' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: string, @Body() updateCampusDto: UpdateCampusDto) {
    if (Object.keys(updateCampusDto).length === 0) {
      throw new BadRequestException('Não foram fornecidos dados para atualização.');
    }

    return this.campusService.update(+id, updateCampusDto);
  }

  @ApiOperation({ summary: 'Remover um campus (Soft Delete)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.campusService.remove(+id);
  }
}