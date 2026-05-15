import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resposta } from './entities/resposta.entity';
import { Pesquisa } from '../pesquisas/entities/pesquisa.entity';
import { RespostasService } from './respostas.service';
import { RespostasController } from './respostas.controller';
import { PesquisaDeletedHandlerResposta } from './handlers/pesquisa-deleted.handler';

@Module({
  // Adicionado o parâmetro 'mongo' para vincular à conexão correta do MongoDB
  imports: [TypeOrmModule.forFeature([Resposta, Pesquisa], 'mongo')],
  providers: [RespostasService,
    PesquisaDeletedHandlerResposta
  ],
  controllers: [RespostasController],
  exports: [RespostasService], 
})
export class RespostasModule {}