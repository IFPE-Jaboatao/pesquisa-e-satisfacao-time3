import { Module } from '@nestjs/common';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';
import { RespostasModule } from '../respostas/respostas.module';
import { PesquisasModule } from '../pesquisas/pesquisas.module'; // 1. Importe o PesquisasModule

@Module({
  imports: [
    RespostasModule, 
    PesquisasModule // Controller ter acesso ao PesquisasService
  ],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}