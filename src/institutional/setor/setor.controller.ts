import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SetorService } from './setor.service';
import { CreateSetorDto } from './dto/create-setor.dto';
import { UpdateSetorDto } from './dto/update-setor.dto';

@Controller('setor')
export class SetorController {
  constructor(private readonly setorService: SetorService) {}

  @Post()
  create(@Body() createSetorDto: CreateSetorDto) {
    return this.setorService.create(createSetorDto);
  }

  @Get()
  findAll(@Query('campusId') campusId?: string) {
    return this.setorService.findAll(campusId ? +campusId : undefined);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSetorDto: UpdateSetorDto) {
    return this.setorService.update(+id, updateSetorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setorService.remove(+id);
  }
}
