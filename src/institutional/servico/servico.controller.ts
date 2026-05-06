import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { ServicoService } from './servico.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';

@Controller('servico')
export class ServicoController {
  constructor(private readonly servicoService: ServicoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createServicoDto: CreateServicoDto) {
    return this.servicoService.create(createServicoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN)
  findAll(@Query('setorId') setorId?: string) {
    return this.servicoService.findAll(setorId ? +setorId : undefined);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.servicoService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: string, @Body() updateServicoDto: UpdateServicoDto) {
    if (Object.keys(updateServicoDto).length === 0) {
      throw new BadRequestException('Não foram fornecidos dados para atualização.');
    }

    return this.servicoService.update(+id, updateServicoDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.servicoService.remove(+id);
  }
}
