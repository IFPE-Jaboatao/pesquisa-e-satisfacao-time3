import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotificacoesService {
  // O Logger é a forma oficial do NestJS de exibir logs sem poluir o terminal
  private readonly logger = new Logger('Notificacoes');

  constructor(private readonly mailService: MailService) {
    this.logger.log('Serviço inicializado e monitorando eventos de auditoria via e-mail.');
  }

  /**
   * Este método é o "ouvinte" (Listener). 
   * Ele é disparado automaticamente quando o AuditoriaService emite 'notificacao.criada'.
   */
  @OnEvent('notificacao.criada')
  async handleNotificacaoEvento(payload: any) {
    // Apenas um log discreto para você saber que o evento foi capturado
    this.logger.log(`Evento recebido: Preparando envio de e-mail para ação "${payload.acao}"`);

    // Delegamos o processamento e formatação para o MailService
    // Isso mantém a responsabilidade de "Notificar" limpa e eficiente
    await this.mailService.enviarNotificacaoAuditoria(payload);
  }
}