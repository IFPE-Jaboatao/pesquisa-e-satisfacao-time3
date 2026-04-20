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

  // Ver as próprias informações (Qualquer usuário logado)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMe(@Req() req) {
    return this.service.findOne(req.user.userId);
  }

  // BUSCAR USUÁRIO POR ID (Ajuste para funcionar GET /users/8)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':userId')
  @Roles(Role.ADMIN)
  findOne(@Param('userId') userId: string) {
    return this.service.findOne(userId);
  }

  // Mudar a própria senha
  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  updatePassword(@Body() dto: UpdatePasswordDto, @Req() req) {
    const userId = req.user.userId;
    return this.service.updatePassword(userId, dto.password);
  }

  // Atualizar usuários (Apenas Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':userId')
  @Roles(Role.ADMIN)
  update(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto,
    @Req() req,
  ) {
    // Garantimos a comparação como string para evitar erros de tipo
    const isOwner = String(req.user.userId) === String(userId);
    const isChangingRole = dto.role && dto.role !== Role.ADMIN;

    if (isOwner && isChangingRole) {
      throw new ForbiddenException(
        'Você não pode alterar o seu próprio nível de acesso (Role)!',
      );
    }

    return this.service.update(userId, dto);
  }

  // Deletar usuários (Apenas Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':userId')
  @Roles(Role.ADMIN)
  delete(@Param('userId') userId: string, @Req() req) {
    const isOwner = String(req.user.userId) === String(userId);

    if (isOwner) {
      throw new ForbiddenException('Um administrador não pode se auto deletar!');
    }

    return this.service.delete(userId);
  }
}
