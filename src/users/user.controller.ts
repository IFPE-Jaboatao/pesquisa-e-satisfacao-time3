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
  ForbiddenException,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';

import { UsersService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from './user-role.enum';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  // Criar usuário (Apenas Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  // Listar todos os usuários (Apenas Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  // Ver as próprias informações
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMe(@Req() req) {
    return this.service.findOne(req.user.id);
  }

  // Ver usuários deletados (Apenas Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('deleted')
  findDeleted() {
    return this.service.findDeleted();
  }

  // Buscar usuário por ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':userId')
  @Roles(Role.ADMIN)
  findOne(@Param('userId', ParseIntPipe) userId: string) {
    return this.service.findOne(userId);
  }

  // Atualizar própria senha
  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  updatePassword(@Body() dto: UpdatePasswordDto, @Req() req) {
    return this.service.updatePassword(req.user.id, dto.password);
  }

  // Atualizar usuário (Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':userId')
  @Roles(Role.ADMIN)
  update(
    @Param('userId', ParseIntPipe) userId: string,
    @Body() dto: UpdateUserDto,
    @Req() req,
  ) {
    // impede patch com body vazio
    if (dto.matricula === undefined && dto.password === undefined && dto.email === undefined && dto.nome === undefined && dto.role === undefined) {
      throw new BadRequestException('Não foram fornecidos dados para atualização!');
    }

    const isOwner = String(req.user.id) === String(userId);
    const isChangingRole = dto.role && dto.role !== Role.ADMIN;

    if (isOwner && isChangingRole) {
      throw new ForbiddenException(
        'Você não pode alterar o seu próprio nível de acesso (Role)!',
      );
    }

    return this.service.update(userId, dto);
  }

  // Deletar usuário (Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':userId')
  @Roles(Role.ADMIN)
  delete(@Param('userId', ParseIntPipe) userId: string, @Req() req) {
    const isOwner = String(req.user.id) === String(userId);

    if (isOwner) {
      throw new ForbiddenException('Um administrador não pode se auto deletar!');
    }

    return this.service.delete(userId);
  }

  // ENDPOINTS DE DASHBOARDS PARA ROLES

  // dashboard de aluno
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ALUNO)
  @Get('dashboard/aluno')
  getDashboardAluno(@Req() req) {
    return this.service.getDashboardAluno(req.user.id);
  }


}