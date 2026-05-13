import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeedService } from './database-seed.service';

// Importa a entidade User para o TypeORM injetar o repositório corretamente
import { User } from '../users/user.entity';
import { Setor } from '../institutional/setor/entities/setor.entity'; // <-- ADICIONADO: Import do Setor

// Importa os módulos donos dos serviços
import { InstitutionalModule } from '../institutional/institutional.module';
import { AcademicModule } from '../academic/academic.module';
import { PesquisasModule } from '../pesquisas/pesquisas.module';

@Module({
  imports: [
    // Injeta o repositório da entidade User apontando para a conexão do MySQL
    TypeOrmModule.forFeature([User, Setor], 'mysql'), // <-- ATUALIZADO: Incluído o Setor na conexão 'mysql'
    
    // Módulos que encapsulam os serviços necessários
    InstitutionalModule,
    AcademicModule,
    PesquisasModule,
  ],
  providers: [DatabaseSeedService],
  exports: [DatabaseSeedService],
})
export class SeedModule {}