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
  @Get('me')
  findOne(@Req() req,) {
    return this.service.findOne(req.user.userId);
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

  // teste de rotas com roles

@UseGuards(JwtAuthGuard, RolesGuard)
@Get('/admin')
@Roles(Role.ADMIN)
testAdmin() {
  return 'admin ok';
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Get('/gestor')
@Roles(Role.GESTOR, Role.ADMIN)
testGestor() {
  return 'gestor ok';
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Get('/aluno')
@Roles(Role.ALUNO, Role.ADMIN)
testAluno() {
  return 'aluno ok';
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Get('/docente')
@Roles(Role.DOCENTE, Role.ADMIN)
testDocente() {
  return 'docente ok';
}

}