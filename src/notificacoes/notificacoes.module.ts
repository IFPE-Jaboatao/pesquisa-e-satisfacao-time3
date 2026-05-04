import { Module } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { MailModule } from '../mail/mail.module'; // Importação do módulo vizinho

@Module({
  imports: [
    MailModule, // ADICIONADO: Permite que o NotificacoesService use o MailService
  ],
  providers: [NotificacoesService],
  exports: [NotificacoesService],
})
export class NotificacoesModule {}