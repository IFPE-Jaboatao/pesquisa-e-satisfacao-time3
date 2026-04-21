import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TurmaService } from './turma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';

@Controller('turma')
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createTurmaDto: CreateTurmaDto) {
    return this.turmaService.create(createTurmaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN)
  findAll(@Query('disciplinaId') disciplinaId?: string) {
    return this.turmaService.findAll(disciplinaId ? +disciplinaId : undefined);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/docente/:id')
  @Roles(Role.ADMIN, Role.DOCENTE)
  findAllProfessor(@Param('id') docenteId: string) {
    return this.turmaService.findAllProfessor(+docenteId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.turmaService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateTurmaDto: UpdateTurmaDto) {
    return this.turmaService.update(+id, updateTurmaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.turmaService.remove(+id);
  }
}
