import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DisciplinaService } from './disciplina.service';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles, ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';

@Controller('disciplina')
export class DisciplinaController {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createDisciplinaDto: CreateDisciplinaDto) {
    return this.disciplinaService.create(createDisciplinaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN, Role.GESTOR)
  findAll(@Query('cursoId') cursoId?: string) {
    return this.disciplinaService.findAll(cursoId ? +cursoId : undefined);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.ADMIN, Role.GESTOR)
  findOne(@Param('id') id: string) {
    return this.disciplinaService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateDisciplinaDto: UpdateDisciplinaDto) {
    return this.disciplinaService.update(+id, updateDisciplinaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.disciplinaService.remove(+id);
  }
}
