import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PesquisasService } from './pesquisas.service';
import { PesquisasController } from './pesquisas.controller';
import { Pesquisa } from './entities/pesquisa.entity';
import { PesquisasCronService } from './pesquisa.cron.service'; // Novo Service de Agendamento

// Entidades vinculadas para operações em cascata e relatórios
import { Questao } from '../questoes/entities/questao.entity';
import { Resposta } from '../respostas/entities/resposta.entity';

// Importações necessárias para Auditoria e Notificações (RF-300)
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { MailModule } from '../mail/mail.module'; // Importado para permitir o envio de e-mails
import { AcademicModule } from 'src/academic/academic.module';
import { QuestoesModule } from 'src/questoes/questoes.module';
import { AppModule } from 'src/app.module';

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
    AuditoriaModule, 
    MailModule, // Adicionado para que o PesquisasCronService possa injetar o MailService
    AcademicModule,
    QuestoesModule
  ],
  providers: [
    PesquisasService, 
    PesquisasCronService, // Registrado como provider para ativar o @Cron
  ],
  controllers: [PesquisasController],
  exports: [PesquisasService], 
})
export class PesquisasModule {}