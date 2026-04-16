import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PesquisasService } from './pesquisas.service';
import { PesquisasController } from './pesquisas.controller';
import { Pesquisa } from './entities/pesquisa.entity';

// Importe as entidades que agora fazem parte da lógica de exclusão
import { Questao } from '../questoes/entities/questao.entity';
import { Resposta } from '../respostas/entities/resposta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Pesquisa, 
        Questao,  //  Adicionado para permitir o deleteMany no Service
        Resposta  //  Adicionado para permitir o deleteMany no Service
      ],
      'mongo',
    ),
  ],
  providers: [PesquisasService],
  controllers: [PesquisasController],
  exports: [PesquisasService], // Exportar caso precise usar em outros módulos no futuro
})
export class PesquisasModule {}