import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  /**
   * RF-300: Envia notificações de abertura, lembrete e encerramento de pesquisas.
   */
  async enviarNotificacao(tipo: 'NOVA_PESQUISA' | 'LEMBRETE_FIM' | 'RESULTADO_DISPONIVEL', dados: any) {
    try {
      const { subject, template } = this.gerarConteudoNotificacao(tipo, dados);

      await this.mailerService.sendMail({
        to: dados.emailDestinatario || 'matheus7778842@gmail.com',
        subject: subject,
        html: template,
      });

      this.logger.log(`[SUCESSO] Notificação ${tipo} enviada para: ${dados.emailDestinatario}`);
    } catch (error: any) {
      this.logger.error(`[ERRO] Falha ao enviar notificação ${tipo}: ${error.message}`);
    }
  }

  private gerarConteudoNotificacao(tipo: string, dados: any) {
    let subject = '';
    let bodyContent = '';

    const dataFinalObj = dados.dataFinal ? new Date(dados.dataFinal) : null;
    const dataFormatada = dataFinalObj ? dataFinalObj.toLocaleDateString('pt-BR') : 'A definir';

    switch (tipo) {
      case 'NOVA_PESQUISA':
        subject = `✨ Nova Pesquisa Disponível: "${dados.titulo || 'Sem Título'}"`;
        bodyContent = `
          <p>Olá! Uma nova pesquisa foi aberta e aguarda sua participação.</p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #2e7d32; margin: 20px 0;">
            <p><strong>Pesquisa:</strong> ${dados.titulo || 'Não informada'}</p>
            <p><strong>Descrição:</strong> ${dados.descricao || 'Sem descrição'}</p>
            <p><strong>Assunto:</strong> ${dados.assunto || 'Geral'}</p>
            <p><strong>📅 Data Limite:</strong> ${dataFormatada}</p>
          </div>
          <a href="${dados.link}" style="background-color: #2e7d32; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Responder Agora</a>
        `;
        break;

      case 'LEMBRETE_FIM':
        // Cálculo dinâmico rigoroso para evitar o erro da imagem image_3b427b.png
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Normaliza para o início do dia
        
        const fim = dataFinalObj ? new Date(dataFinalObj) : new Date();
        fim.setHours(0, 0, 0, 0);

        const diffTime = fim.getTime() - hoje.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let prazoTexto = '';
        if (diffDays <= 0) {
          prazoTexto = 'Ela encerra <strong>HOJE</strong>! Não perca a chance de participar.';
        } else if (diffDays === 1) {
          prazoTexto = 'Ela ficará disponível por apenas mais <strong>1 dia</strong>.';
        } else {
          prazoTexto = `Ela ficará disponível por apenas mais <strong>${diffDays} dias</strong>.`;
        }

        subject = `⏰ ÚLTIMO CHAMADO: A pesquisa "${dados.titulo || 'Sua Pesquisa'}"`;
        bodyContent = `
          <p>Olá! Notamos que você ainda não respondeu à pesquisa <strong>"${dados.titulo || 'em aberto'}"</strong>.</p>
          <p>${prazoTexto} Sua opinião é fundamental!</p>
          <a href="${dados.link}" style="background-color: #d32f2f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">Participar Agora</a>
        `;
        break;

      case 'RESULTADO_DISPONIVEL':
        subject = `📊 Resultados Disponíveis: ${dados.assunto || dados.titulo || 'Avaliações Finalizadas'}`;
        bodyContent = `
          <p>Olá! As avaliações do período foram encerradas com sucesso.</p>
          <p>Os resultados e relatórios detalhados da pesquisa <strong>"${dados.titulo || dados.assunto}"</strong> já estão disponíveis para consulta no sistema.</p>
          <a href="${dados.link}" style="background-color: #1976d2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">Acessar Relatórios</a>
        `;
        break;
      
      default:
        subject = 'Notificação Survey System';
        bodyContent = '<p>Você tem uma nova atualização no sistema de pesquisas.</p>';
    }

    const template = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 10px;">Survey System - IFPE</h2>
        <div style="padding: 20px 0; color: #333;">
          ${bodyContent}
        </div>
        <footer style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
          <p>Este é um e-mail automático do sistema de pesquisas do IFPE Jaboatão. Por favor, não responda.</p>
        </footer>
      </div>
    `;

    return { subject, template };
  }

  async enviarNotificacaoAuditoria(log: any) {
    try {
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
      this.logger.log(`[SUCESSO] E-mail de auditoria enviado para: matheus7778842@gmail.com`);
    } catch (error: any) { 
      this.logger.error(`[ERRO] Falha ao enviar auditoria: ${error.message}`);
    }
  }
}