import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Módulos de Infraestrutura e Segurança
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { AnonymousModule } from './anonymous/anonymous.module'; 
import { AuditoriaModule } from './auditoria/auditoria.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';
import { RelatoriosModule } from './relatorios/relatorios.module';

// Módulos de Negócio (Pesquisas)
import { PesquisasModule } from './pesquisas/pesquisas.module';
import { QuestoesModule } from './questoes/questoes.module';
import { RespostasModule } from './respostas/respostas.module';

// Módulos Institucionais e Acadêmicos
import { InstitutionalModule } from './institutional/institutional.module';
import { AcademicModule } from './academic/academic.module';

// Entidades MySQL
import { User } from './users/user.entity';
import { Campus } from './institutional/campus/entities/campus.entity';
import { Servico } from './institutional/servico/entities/servico.entity';
import { Setor } from './institutional/setor/entities/setor.entity';
import { Curso } from './academic/curso/entities/curso.entity';
import { Disciplina } from './academic/disciplina/entities/disciplina.entity';
import { Matricula } from './academic/matricula/entities/matricula.entity';
import { Periodo } from './academic/periodo/entities/periodo.entity';
import { Turma } from './academic/turma/entities/turma.entity';

// Entidades MongoDB
import { Pesquisa } from './pesquisas/entities/pesquisa.entity';
import { Questao } from './questoes/entities/questao.entity';
import { Resposta } from './respostas/entities/resposta.entity';
import { Auditoria } from './auditoria/entities/auditoria.entity';

@Module({
  imports: [
    // 1. SUPORTE A EVENTOS (Notificações assíncronas)
    EventEmitterModule.forRoot(),

    // 2. CONFIGURAÇÃO GLOBAL (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 3. CONEXÃO MONGODB (Pesquisas, Questões, Respostas e Logs)
    TypeOrmModule.forRootAsync({
      name: 'mongo',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('MONGO_URL');
        if (!url) throw new Error('MONGO_URL não definido no .env');

        return {
          type: 'mongodb',
          url,
          entities: [Pesquisa, Questao, Resposta, Auditoria],
          synchronize: true, 
          useUnifiedTopology: true,
        };
      },
    }),

    // 4. CONEXÃO MYSQL (Auth, Usuários, Institucional e Acadêmico)
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

        if (!host || !user || !db) {
          throw new Error('Variáveis do MySQL não definidas no .env');
        }

        return {
          type: 'mysql',
          host,
          port: parseInt(port || '3306'),
          username: user,
          password: pass,
          database: db,
          entities: [
            User, Campus, Setor, Servico, 
            Curso, Disciplina, Matricula, Periodo, Turma
          ],
          synchronize: true, // Em produção, prefira Migrations
        };
      },
    }),

    // 5. RATE LIMIT (Proteção contra brute force)
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),

    // 6. REGISTRO DE MÓDULOS
    UsersModule,
    AuthModule,
    PesquisasModule,
    QuestoesModule,
    RespostasModule,
    AnonymousModule,
    RelatoriosModule,
    AuditoriaModule,
    NotificacoesModule,
    InstitutionalModule,
    AcademicModule,
  ],
})
export class AppModule {}