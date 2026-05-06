import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { CampusService } from './campus.service';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/user-role.enum';

@Controller('campus')
export class CampusController {
  constructor(private readonly campusService: CampusService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createCampusDto: CreateCampusDto) {
    return this.campusService.create(createCampusDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.campusService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/deleted')
  @Roles(Role.ADMIN)
  findAllDeleted() {
    return this.campusService.findAllDeleted();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.campusService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/full')
  @Roles(Role.ADMIN)
  findOneFull(@Param('id', ParseIntPipe) id: string) {
    return this.campusService.findOneFull(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: string, @Body() updateCampusDto: UpdateCampusDto) {
    if (Object.keys(updateCampusDto).length === 0) {
      throw new BadRequestException('Não foram fornecidos dados para atualização.');
    }

    return this.campusService.update(+id, updateCampusDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.campusService.remove(+id);
  }
}
