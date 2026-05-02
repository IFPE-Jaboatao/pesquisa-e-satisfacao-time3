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
import { AuditoriaModule } from './auditoria/auditoria.module';
import { InstitutionalModule } from './institutional/institutional.module';
import { AcademicModule } from './academic/academic.module';
import { RelatoriosModule } from './relatorios/relatorios.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    // 1. CONFIGURAÇÃO GLOBAL (Carrega .env de teste ou padrão)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.test', '.env'], 
    }),

    // 2. CONEXÃO MONGODB (Pesquisas, Questões, Respostas e Auditoria)
    TypeOrmModule.forRootAsync({
      name: 'mongo',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mongodb',
        url: config.get<string>('MONGO_URL'),
        autoLoadEntities: true, // Automatiza a detecção de entidades Mongo
        synchronize: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),

    // 3. CONEXÃO MYSQL (Usuários, Auth, Acadêmico e Institucional)
    TypeOrmModule.forRootAsync({
      name: 'mysql',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true, // Automatiza a detecção de entidades MySQL
        synchronize: true,
        // Proteções críticas para estabilidade no CI/CD
        connectTimeout: 10000, 
        retryAttempts: 2,      
        retryDelay: 3000,
        keepConnectionAlive: true,
      }),
    }),

    // 4. SEGURANÇA: RATE LIMIT (Proteção contra força bruta/DoS)
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 15,
    }]),

    // 5. MÓDULOS DO SISTEMA
    AuditoriaModule,
    UsersModule,
    AuthModule,
    PesquisasModule,
    QuestoesModule,
    RespostasModule,
    AnonymousModule,
    RelatoriosModule, // Módulo de exportação integrado
    InstitutionalModule,
    AcademicModule,
  ],
  providers: [AppService],
  controllers: [AppController]
})
export class AppModule {}