import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resposta } from './entities/resposta.entity';
import { Pesquisa } from '../pesquisas/entities/pesquisa.entity';
import { RespostasService } from './respostas.service';
import { RespostasController } from './respostas.controller';
import { PesquisaDeletedHandlerResposta } from './handlers/pesquisa-deleted.handler';
import { InstitutionalModule } from 'src/institutional/institutional.module';
import { AlunoDeletedHandlerResposta } from './handlers/aluno-deleted.handler';
import { MatriculaDeletedHandlerResposta } from './handlers/matricula-deleted.handler';

@Module({
  // Adicionado o parâmetro 'mongo' para vincular à conexão correta do MongoDB
  imports: [TypeOrmModule.forFeature([Resposta, Pesquisa], 'mongo'),
    InstitutionalModule
],
  providers: [RespostasService,
    PesquisaDeletedHandlerResposta,
    AlunoDeletedHandlerResposta,
    MatriculaDeletedHandlerResposta
  ],
  controllers: [RespostasController],
  exports: [RespostasService], 
})
export class RespostasModule {}