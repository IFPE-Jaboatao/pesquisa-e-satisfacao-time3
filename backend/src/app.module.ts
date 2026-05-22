import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

// Módulos de Infraestrutura e Segurança
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { AnonymousModule } from './anonymous/anonymous.module'; 
import { AuditoriaModule } from './auditoria/auditoria.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';
import { MailModule } from './mail/mail.module'; 
import { RelatoriosModule } from './relatorios/relatorios.module';
import { SeedModule } from './seed/seed.module';

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

// Controllers e Services Base
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 1. SUPORTE A EVENTOS E AGENDAMENTO
    EventEmitterModule.forRoot(),
    // MANTIDO: Lógica de branch para evitar disparos de Cron em ambiente de teste
    ...(process.env.NODE_ENV !== 'test' ? [ScheduleModule.forRoot()] : []),

    // 2. CONFIGURAÇÃO GLOBAL
    // RECOMENDADO: Ordem da Main para proteger o banco de produção no CI
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['test/.env', '.env.test', '.env'], 
    }),

    // 3. CONEXÃO MONGODB
    TypeOrmModule.forRootAsync({
      name: 'mongo',
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
          connectTimeoutMS: 10000,
        };
      },
    }),

    // 4. CONEXÃO MYSQL
    TypeOrmModule.forRootAsync({
      name: 'mysql',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST');
        const user = config.get<string>('DB_USER');
        const db = config.get<string>('DB_NAME');

        if (!host || !user || !db) {
          throw new Error('Variáveis do MySQL não definidas no .env');
        }

        return {
          type: 'mysql',
          host,
          port: config.get<number>('DB_PORT', 3306),
          username: user,
          password: config.get<string>('DB_PASS'),
          database: db,
          entities: [
            User, Campus, Setor, Servico, 
            Curso, Disciplina, Matricula, Periodo, Turma
          ],
          // MANTIDO: Sincronização para refletir o Soft Delete da Adila
          synchronize: true, 
          connectTimeout: 10000, 
          retryAttempts: 2,      
          keepConnectionAlive: true,
        };
      },
    }),

    // 5. RATE LIMIT
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 15,
    }]),

    // 6. REGISTRO DE MÓDULOS DE DOMÍNIO
    AuditoriaModule,
    // ADICIONADO: MailModule da sua branch para a automação funcionar
    MailModule,          
    NotificacoesModule,  
    UsersModule,
    AuthModule,
    PesquisasModule,
    QuestoesModule,
    RespostasModule,
    AnonymousModule,
    RelatoriosModule,
    InstitutionalModule,
    AcademicModule,
    
    // CORRIGIDO: Trava condicional adicionada para evitar execução do Seed no ambiente de teste (CI)
    ...(process.env.NODE_ENV !== 'test' ? [SeedModule] : []),
  ],
  // MANTIDO: Estrutura da Main para evitar o erro 404 na rota '/'
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}