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

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

    // 🔒 Listar todos
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🔒 Buscar por ID
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.service.findOne(userId);
  }

    @UseGuards(JwtAuthGuard)
  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body() dto: Partial<{ username: string; password: string }>,
    @Req() req,
  ) {

    const isOwner = req.user.userId == userId;

    if (!isOwner) {
      throw new ForbiddenException("Você não tem permissão para alterar outro usuário!")
    }
    return this.service.update(userId, dto);
  }

 // 🔒 Deletar
  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  delete(@Param('userId') userId: string,
  @Req() req,) {

    const isOwner = req.user.userId == userId;

    if (!isOwner) {
      throw new ForbiddenException("Voce não tem permissão para deletar outro usuário!")
    }

    return this.service.delete(userId);
  }
}