import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { SetorService } from './setor.service';
import { CreateSetorDto } from './dto/create-setor.dto';
import { UpdateSetorDto } from './dto/update-setor.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/users/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('setor')
export class SetorController {
  constructor(private readonly setorService: SetorService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createSetorDto: CreateSetorDto) {
    return this.setorService.create(createSetorDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN)
  findAll(@Query('campusId') campusId?: string) {
    return this.setorService.findAll(campusId ? +campusId : undefined);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.setorService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: string, @Body() updateSetorDto: UpdateSetorDto) {
    if (Object.keys(updateSetorDto).length === 0) {
      throw new BadRequestException('Não foram fornecidos dados para atualização!');
    }

    return this.setorService.update(+id, updateSetorDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.setorService.remove(+id);
  }
}
