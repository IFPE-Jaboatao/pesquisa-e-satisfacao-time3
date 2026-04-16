import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
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
  ) {
    return this.service.update(userId, dto);
  }

 // 🔒 Deletar
  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  delete(@Param('userId') userId: string) {
    return this.service.delete(userId);
  }
}