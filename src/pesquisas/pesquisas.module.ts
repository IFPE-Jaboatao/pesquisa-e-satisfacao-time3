import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PesquisasService } from './pesquisas.service';
import { PesquisasController } from './pesquisas.controller';
import { Pesquisa } from './entities/pesquisa.entity';

// Entidades vinculadas para operações em cascata e relatórios
import { Questao } from '../questoes/entities/questao.entity';
import { Resposta } from '../respostas/entities/resposta.entity';

// Importação necessária para o AuditoriaService injetado no PesquisasService
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Pesquisa, 
        Questao,  
        Resposta  
      ],
      'mongo',
    ),
    // Adicionado para suportar a lógica de logs de alteração e exclusão
    AuditoriaModule, 
  ],
  providers: [PesquisasService],
  controllers: [PesquisasController],
  // Exportamos o service para que RelatoriosModule possa utilizá-lo se necessário
  exports: [PesquisasService], 
})
export class PesquisasModule {}