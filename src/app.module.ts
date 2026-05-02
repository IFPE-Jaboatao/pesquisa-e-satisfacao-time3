import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

// Módulos de Domínio
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { PesquisasModule } from './pesquisas/pesquisas.module';
import { QuestoesModule } from './questoes/questoes.module';
import { RespostasModule } from './respostas/respostas.module';
import { AnonymousModule } from './anonymous/anonymous.module'; 
import { AuditoriaModule } from './auditoria/auditoria.module'; // Integrado conforme desenvolvimento

// Entidades MySQL
import { User } from './users/user.entity';
import { InstitutionalModule } from './institutional/institutional.module';
import { Campus } from './institutional/campus/entities/campus.entity';
import { Servico } from './institutional/servico/entities/servico.entity';
import { Setor } from './institutional/setor/entities/setor.entity';
import { AcademicModule } from './academic/academic.module';
import { Curso } from './academic/curso/entities/curso.entity';
import { Disciplina } from './academic/disciplina/entities/disciplina.entity';
import { Matricula } from './academic/matricula/entities/matricula.entity';
import { Periodo } from './academic/periodo/entities/periodo.entity';
import { Turma } from './academic/turma/entities/turma.entity';

// Entidades Mongo
import { Pesquisa } from './pesquisas/entities/pesquisa.entity';
import { Questao } from './questoes/entities/questao.entity';
import { Resposta } from './respostas/entities/resposta.entity';
import { Auditoria } from './auditoria/entities/auditoria.entity'; // Integrado conforme desenvolvimento

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    // ENV GLOBAL
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MONGO (pesquisas, questões, respostas, auditoria)
    TypeOrmModule.forRootAsync({
      name: 'mongo',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('MONGO_URL');

        if (!url) {
          throw new Error('MONGO_URL não definido no .env');
        }

        return {
          type: 'mongodb',
          url,
          entities: [Pesquisa, Questao, Resposta, Auditoria], // Adicionado Auditoria
          synchronize: true, 
          useUnifiedTopology: true,
        };
      },
    }),

    // MYSQL (users/admin/auth/institutional/academic)
    TypeOrmModule.forRootAsync({
      name: 'mysql',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST');
        const port = config.get<string>('DB_PORT');
        const user = config.get<string>('DB_USER');
        const pass = config.get<string>('DB_PASS');
        const db = config.get<string>('DB_NAME');

        // Se estivermos em ambiente de teste e as variáveis faltarem, o log avisará
        if (!host || !user || !db) {
          console.warn('Variáveis do MySQL não definidas. Verifique o CI/Secrets.');
        }

        return {
          type: 'mysql',
          host: host || 'localhost',
          port: parseInt(port || '3306'),
          username: user,
          password: pass,
          database: db,
          entities: [User, Campus, Setor, Servico, Curso, Disciplina, Matricula, Periodo, Turma],
          synchronize: true,
          // Correção para o erro de travamento no CI
          connectTimeout: 10000, // 10 segundos
          retryAttempts: 2,      // Evita o loop infinito de conexão no GitHub Actions
          retryDelay: 3000,
        };
      },
    }),

    // RATE LIMIT GLOBAL
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),

    // MODULES
    AuditoriaModule, // Módulo Global
    UsersModule,
    AuthModule,
    PesquisasModule,
    QuestoesModule,
    RespostasModule,
    AnonymousModule,
    InstitutionalModule,
    AcademicModule,
  ],
  providers: [AppService],
  controllers: [AppController]
})
export class AppModule {}