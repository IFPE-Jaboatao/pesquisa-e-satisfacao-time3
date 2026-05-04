import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  /**
   * Envia uma notificação de e-mail baseada nos logs capturados
   * pelo AuditoriaService.
   */
  async enviarNotificacaoAuditoria(log: any) {
    try {
      // Extraímos os dados novos para detalhamento no HTML
      const detalhes = log.dadosNovos || {};
      
      await this.mailerService.sendMail({
        to: 'matheus7778842@gmail.com', 
        subject: `🚨 Auditoria: ${log.acao || 'Ação'} em ${log.entidade || 'Entidade'}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #e0e0e0; padding: 25px; border-radius: 10px; color: #333; max-width: 600px;">
            <h2 style="color: #2e7d32; margin-top: 0;">Relatório de Auditoria - Survey System</h2>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p><strong>👤 Usuário:</strong> ${log.usuarioNome || 'Desconhecido'}</p>
              <p><strong>🎯 Ação:</strong> <span style="color: #d32f2f; font-weight: bold;">${log.acao || 'N/A'}</span></p>
              <p><strong>📅 Data:</strong> ${log.timestamp ? new Date(log.timestamp).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR')}</p>
            </div>

            <h3 style="border-bottom: 2px solid #2e7d32; padding-bottom: 5px;">Detalhamento da Entidade: ${log.entidade || 'N/A'}</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              ${detalhes.titulo ? `<tr><td style="padding: 8px 0; width: 120px;"><strong>Título:</strong></td><td>${detalhes.titulo}</td></tr>` : ''}
              ${detalhes.pesquisaId ? `<tr><td style="padding: 8px 0; width: 120px;"><strong>Pesquisa Ref:</strong></td><td><code>${detalhes.pesquisaId}</code></td></tr>` : ''}
              
              <!-- Início da Lógica para Múltiplas Respostas -->
              ${detalhes.respostas && Array.isArray(detalhes.respostas) 
                ? detalhes.respostas.map((r: any, index: number) => `
                    <tr>
                      <td colspan="2" style="padding: 10px 0; border-bottom: 1px solid #eee;">
                        <div style="font-size: 12px; color: #666;">Questão ${index + 1} (ID: ${r.questaoId})</div>
                        <div style="margin-top: 4px;"><strong>Resposta:</strong> ${r.valor}</div>
                      </td>
                    </tr>
                  `).join('')
                : ''
              }
              <!-- Fim da Lógica para Múltiplas Respostas -->

              ${detalhes.pergunta ? `<tr><td style="padding: 8px 0; width: 120px;"><strong>Pergunta:</strong></td><td>${detalhes.pergunta}</td></tr>` : ''}
              ${detalhes.tipo ? `<tr><td style="padding: 8px 0;"><strong>Tipo:</strong></td><td><span style="background: #eee; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${detalhes.tipo}</span></td></tr>` : ''}
              ${detalhes.escalaMax ? `<tr><td style="padding: 8px 0; width: 120px;"><strong>Escala Máx:</strong></td><td>${detalhes.escalaMax}</td></tr>` : ''}
              ${detalhes.opcoes && detalhes.opcoes.length > 0 ? `<tr><td style="padding: 8px 0;"><strong>Opções:</strong></td><td>${detalhes.opcoes.join(' | ')}</td></tr>` : ''}
            </table>

            <div style="margin-top: 25px; padding-top: 15px; border-top: 1px dashed #ccc; font-size: 12px; color: #777;">
              <p><strong>ID da Entidade:</strong> ${log.entidadeId || detalhes.id || detalhes._id || 'N/A'}</p>
              <p><strong>Log ID (MongoDB):</strong> ${log._id || 'N/A'}</p>
            </div>
          </div>
        `,
      });
      this.logger.log(`[SUCESSO] E-mail detalhado enviado para: matheus7778842@gmail.com`);
    } catch (error: any) { 
      this.logger.error(`[ERRO] Falha ao enviar e-mail: ${error.message}`);
    }
  }
}