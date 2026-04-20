import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { PesquisasModule } from './pesquisas/pesquisas.module';
import { QuestoesModule } from './questoes/questoes.module';
import { RespostasModule } from './respostas/respostas.module';
import { AnonymousModule } from './anonymous/anonymous.module'; 

import { User } from './users/user.entity';

// Entidades Mongo
import { Pesquisa } from './pesquisas/entities/pesquisa.entity';
import { Questao } from './questoes/entities/questao.entity';
import { Resposta } from './respostas/entities/resposta.entity';
import { InstitutionalModule } from './institutional/institutional.module';

@Module({
  imports: [
    // ENV GLOBAL
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MONGO (pesquisas, questões, respostas)
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
          entities: [Pesquisa, Questao, Resposta],
          synchronize: true, 
          useUnifiedTopology: true,
        };
      },
    }),

    // MYSQL (users/admin/auth)
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
          host: host,
          port: parseInt(port || '3306'),
          username: user,
          password: pass,
          database: db,
          entities: [User],
          synchronize: true,
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
    UsersModule,
    AuthModule,
    PesquisasModule,
    QuestoesModule,
    RespostasModule,
    AnonymousModule,
    InstitutionalModule,
  ],
})
export class AppModule {}