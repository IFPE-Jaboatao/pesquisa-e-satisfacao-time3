import { Injectable } from '@nestjs/common';
import { Parser } from 'json2csv';
import * as PDFKit from 'pdfkit';

@Injectable()
export class RelatoriosService {
  
  /**
   * Consolida questões e respostas sem poluição de logs no terminal.
   */
  private prepararDados(pesquisa: any, respostas: any[]) {
    const resumo: Record<string, { pergunta: string; valores: Record<string, number> }> = {};
    const tituloPesquisa = pesquisa?.titulo || 'Relatório de Pesquisa';

    const mapaQuestoes = new Map<string, string>();
    const listaQuestoes = pesquisa?.questoes || [];
    
    // 1. Mapeamento silencioso das questões
    listaQuestoes.forEach((q: any) => {
      const idBruto = q._id || q.id;
      if (idBruto) {
        const idNormalizado = String(idBruto).trim().toLowerCase();
        mapaQuestoes.set(idNormalizado, q.pergunta || q.enunciado || 'Questão sem título');
      }
    });

    // 2. Processamento das respostas
    respostas.forEach((r) => {
      const itens = r?.respostas || [];
      
      if (Array.isArray(itens)) {
        itens.forEach((item: any) => {
          const qIdBruto = item.questaoId;
          if (!qIdBruto) return;

          const qId = String(qIdBruto).trim().toLowerCase();

          // Recupera o texto da pergunta ou usa o fallback caso o ID seja órfão
          const textoPergunta = mapaQuestoes.get(qId) || `Questão (Ref: ${qId.substring(0, 6)}...)`;
          const valor = String(item.valor || 'Sem Resposta');

          if (!resumo[qId]) {
            resumo[qId] = { pergunta: textoPergunta, valores: {} };
          }
          
          resumo[qId].valores[valor] = (resumo[qId].valores[valor] || 0) + 1;
        });
      }
    });

    return { tituloPesquisa, dados: Object.values(resumo) };
  }

  async exportarResumoPDF(pesquisa: any, respostas: any[]): Promise<Buffer> {
    const info = this.prepararDados(pesquisa, respostas);

    return new Promise((resolve, reject) => {
      try {
        const PDFDocument = (PDFKit as any).PDFDocument || (PDFKit as any).default || PDFKit;
        const doc = new PDFDocument({ 
          margin: 50, 
          size: 'A4',
          info: { Title: info.tituloPesquisa } 
        });
        
        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Estilização do Cabeçalho
        doc.rect(0, 0, 612, 80).fillColor('#f8f9fa').fill();
        doc.fillColor('#212529').fontSize(16).font('Helvetica-Bold')
           .text(info.tituloPesquisa.toUpperCase(), 50, 35, { align: 'center', width: 500 });
        
        doc.fontSize(8).fillColor('#6c757d').font('Helvetica')
           .text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 50, 90, { align: 'right' });
        
        doc.moveDown(3);

        // Listagem dos dados
        if (info.dados.length === 0) {
          doc.fillColor('#dc3545').fontSize(12).text('Nenhum dado consolidado encontrado.', { align: 'center' });
        } else {
          info.dados.forEach((item: any) => {
            if (doc.y > 700) doc.addPage();

            doc.fillColor('#0056b3').fontSize(11).font('Helvetica-Bold').text(`PERGUNTA: ${item.pergunta}`);
            doc.moveDown(0.5);

            for (const [opcao, total] of Object.entries(item.valores)) {
              doc.fillColor('#495057').fontSize(10).font('Helvetica').text(`  • ${opcao}: `, { continued: true })
                 .font('Helvetica-Bold').text(`${total} ocorrência(s)`);
            }
            
            doc.moveDown(1.2);
            doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#eeeeee').lineWidth(0.5).stroke();
            doc.moveDown(1.2);
          });
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  async exportarResumoCSV(pesquisa: any, respostas: any[]): Promise<string> {
    const info = this.prepararDados(pesquisa, respostas);
    const rows: any[] = [];

    info.dados.forEach((item: any) => {
      for (const [valor, total] of Object.entries(item.valores)) {
        rows.push({
          Pesquisa: info.tituloPesquisa,
          Questao: item.pergunta,
          Resposta: valor,
          Total: total
        });
      }
    });

    const parser = new Parser({ 
      fields: ['Pesquisa', 'Questao', 'Resposta', 'Total'], 
      delimiter: ';', 
      withBOM: true 
    });
    return parser.parse(rows);
  }
}