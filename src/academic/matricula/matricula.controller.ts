import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';

@Controller('matricula')
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createMatriculaDto: CreateMatriculaDto) {
    return this.matriculaService.create(createMatriculaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN, Role.GESTOR)
  findAll(@Query('turmaId') turmaId?: string) {
    return this.matriculaService.findAll(turmaId ? +turmaId : undefined);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/aluno/:id')
  @Roles(Role.ADMIN, Role.ALUNO)
  findAllStudent(@Param('id') alunoId: string) {
    return this.matriculaService.findAllStudent(+alunoId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.matriculaService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateMatriculaDto: UpdateMatriculaDto) {
    return this.matriculaService.update(+id, updateMatriculaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.matriculaService.remove(+id);
  }
}
