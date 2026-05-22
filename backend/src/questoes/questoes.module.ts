import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questao } from './entities/questao.entity';
import { Pesquisa } from '../pesquisas/entities/pesquisa.entity'; // Importação necessária
import { QuestoesService } from './questoes.service';
import { QuestoesController } from './questoes.controller';
import { PesquisaDeletedHandlerQuestao } from './handlers/pesquisa-deleted.handler';

@Module({
  // Adicionamos 'Pesquisa' ao array para que o Service possa injetá-la
  imports: [TypeOrmModule.forFeature([Questao, Pesquisa], 'mongo')], 
  providers: [QuestoesService,
    PesquisaDeletedHandlerQuestao
  ],
  controllers: [QuestoesController],
  exports: [QuestoesService]
})
export class QuestoesModule {}