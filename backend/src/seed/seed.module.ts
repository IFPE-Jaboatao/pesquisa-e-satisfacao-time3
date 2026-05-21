import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeedService } from './database-seed.service';

// Importações das Entidades Necessárias
import { User } from '../users/user.entity';
import { Setor } from '../institutional/setor/entities/setor.entity';
import { Pesquisa } from '../pesquisas/entities/pesquisa.entity';
import { Questao } from '../questoes/entities/questao.entity'; // <-- Certifique-se de importar a entidade
import { Resposta } from '../respostas/entities/resposta.entity';

// Importações dos Módulos que possuem os Serviços que você injetou
import { InstitutionalModule } from '../institutional/institutional.module';
import { AcademicModule } from '../academic/academic.module';

@Module({
  imports: [
    // Registro dos repositórios nas conexões corretas para uso no Seed
    TypeOrmModule.forFeature([User, Setor], 'mysql'),
    
    // ADICIONADO: Incluído 'Questao' no array da conexão 'mongo'
    TypeOrmModule.forFeature([Pesquisa, Questao, Resposta], 'mongo'),
    
    // Módulos que exportam os serviços (CampusService, CursoService, etc.)
    InstitutionalModule,
    AcademicModule,
  ],
  providers: [DatabaseSeedService],
  exports: [DatabaseSeedService], // Opcional, caso precise acionar externamente
})
export class SeedModule {}