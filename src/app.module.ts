import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter'; // Adicionado para notificações

// Módulos do Sistema
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { PesquisasModule } from './pesquisas/pesquisas.module';
import { QuestoesModule } from './questoes/questoes.module';
import { RespostasModule } from './respostas/respostas.module';
import { AnonymousModule } from './anonymous/anonymous.module'; 
import { RelatoriosModule } from './relatorios/relatorios.module'; 
import { AuditoriaModule } from './auditoria/auditoria.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module'; // Novo módulo de notificações

// Entidades MySQL
import { User } from './users/user.entity';

// Entidades MongoDB
import { Pesquisa } from './pesquisas/entities/pesquisa.entity';
import { Questao } from './questoes/entities/questao.entity';
import { Resposta } from './respostas/entities/resposta.entity';
import { Auditoria } from './auditoria/entities/auditoria.entity';

@Module({
  imports: [
    // 1. EVENTOS GLOBAIS (Para o sistema de notificações)
    EventEmitterModule.forRoot(),

    // 2. CONFIGURAÇÃO DE AMBIENTE (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 3. CONEXÃO MONGODB (Dados Dinâmicos e Auditoria)
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

    // 4. CONEXÃO MYSQL (Usuários e Autenticação)
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

        if (!host || !user || !db) throw new Error('Variáveis MySQL não definidas no .env');

        return {
          type: 'mysql',
          host,
          port: parseInt(port || '3306'),
          username: user,
          password: pass,
          database: db,
          entities: [User],
          synchronize: true,
        };
      },
    }),

    // 5. SEGURANÇA (Rate Limit)
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),

    // 6. MÓDULOS DA APLICAÇÃO
    UsersModule,
    AuthModule,
    PesquisasModule,
    QuestoesModule,
    RespostasModule,
    AnonymousModule,
    RelatoriosModule, 
    AuditoriaModule,
    NotificacoesModule, // Registrado para escutar os eventos de auditoria
  ],
})
export class AppModule {}