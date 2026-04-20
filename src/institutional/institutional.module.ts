import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Campus } from './campus/entities/campus.entity';
import { Setor } from './setor/entities/setor.entity';
import { Servico } from './servico/entities/servico.entity';

import { CampusController } from './campus/campus.controller';
import { SetorController } from './setor/setor.controller';
import { ServicoController } from './servico/servico.controller';

import { CampusService } from './campus/campus.service';
import { SetorService } from './setor/setor.service';
import { ServicoService } from './servico/servico.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campus, Setor, Servico], 'mysql')
  ],
  controllers: [
    CampusController,
    SetorController,
    ServicoController,
  ],
  providers: [
    CampusService,
    SetorService,
    ServicoService,
  ],
  exports: [
    CampusService,
    SetorService,
    ServicoService,
  ],
})
export class InstitutionalModule {}
