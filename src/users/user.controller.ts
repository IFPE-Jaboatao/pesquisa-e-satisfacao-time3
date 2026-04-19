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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  // 🔒 Listar todos os usuários
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  // ver as próprias informações
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findOne(@Req() req) {
    return this.service.findOne(req.user.userId);
  }

  // mudar senha, para qualquer usuário
  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  updatePassword(@Body() dto: UpdatePasswordDto, @Req() req) {
  const userId = req.user.userId;

  return this.service.updatePassword(userId, dto.password);
}

  // update de usuários apenas para admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':userId')
  @Roles(Role.ADMIN)
  update(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto,
    @Req() req,
  ) {
    const isOwner = req.user.userId == userId;
    const isChangingRole = dto.role && dto.role !== Role.ADMIN;

    if (isOwner && isChangingRole) {
      throw new ForbiddenException(
        'Você não pode alterar o seu role de Admin!',
      );
    }

    return this.service.update(userId, dto);
  }

  // 🔒 Deletar
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':userId')
  @Roles(Role.ADMIN)
  delete(@Param('userId') userId: string, @Req() req) {
    const isOwner = req.user.userId == userId;

    if (isOwner) {
      throw new ForbiddenException('Um admin não pode se auto deletar!');
    }

    return this.service.delete(userId);
  }
}
