import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificacoesService {
  
  constructor() {
    // Log fundamental: se este log não aparecer ao iniciar o servidor (npm run start:dev),
    // significa que o NotificacoesModule não foi importado no AppModule.
    console.log(' [SISTEMA] NotificacoesService inicializado e monitorando eventos de auditoria.');
  }

  /**
   * Este método é o "ouvinte" (Listener). 
   * Ele é disparado automaticamente quando o AuditoriaService emite 'notificacao.criada'.
   */
  @OnEvent('notificacao.criada')
  handleNotificacaoEvento(payload: any) {
    // PASSO FINAL: Confirmação de que o sinal cruzou os módulos com sucesso
    console.log('[PASSO FINAL] NotificacoesService: SINAL RECEBIDO! Renderizando banner...');

    console.log('\n' + '='.repeat(50));
    console.log('       NOVA NOTIFICAÇÃO DE AUDITORIA      ');
    console.log('='.repeat(50));
    
    // Informações de quem e o que foi feito
    console.log(` USUÁRIO: ${payload.usuarioNome || 'Desconhecido'}`);
    console.log(` ID USER: ${payload.usuarioId || 'N/A'}`);
    console.log(` AÇÃO:    ${payload.acao || 'N/A'}`);
    console.log(` OBJETO:  ${payload.entidade || 'N/A'} (ID: ${payload.entidadeId || 'N/A'})`);
    
    // Formatação da data
    const dataFormatada = payload.timestamp 
      ? new Date(payload.timestamp).toLocaleString('pt-BR') 
      : new Date().toLocaleString('pt-BR');
    console.log(` DATA:    ${dataFormatada}`);

    // Exibição detalhada das alterações
    if (payload.dadosNovos) {
      console.log(` NOVOS DADOS: ${JSON.stringify(payload.dadosNovos)}`);
    }

    if (payload.dadosAnteriores) {
      console.log(` DADOS ANTIGOS: ${JSON.stringify(payload.dadosAnteriores)}`);
    }

    console.log('='.repeat(50) + '\n');
  }
}