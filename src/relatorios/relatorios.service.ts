import { Injectable } from '@nestjs/common';
import { Parser } from 'json2csv';
import * as PDFDocument from 'pdfkit';

interface RespostaItem {
  questaoId: string | number;
  valor: string | number;
}

interface RespostaData {
  respostas: RespostaItem[];
}

interface DadosCSV {
  Questao: string;
  Resposta: string;
  Total: number;
}

@Injectable()
export class RelatoriosService {
  
  /**
   * Agrupa as respostas para contar a frequência de cada valor por questão
   */
  gerarResumo(respostas: RespostaData[]) {
    const resumo: Record<string, Record<string, number>> = {};
    
    // Verificação de segurança para evitar erros em arrays vazios ou nulos
    if (!respostas || respostas.length === 0) return resumo;

    respostas.forEach((r) => {
      // Garante que r.respostas existe antes de iterar
      if (r.respostas && Array.isArray(r.respostas)) {
        r.respostas.forEach((resp) => {
          if (!resumo[resp.questaoId]) resumo[resp.questaoId] = {};
          if (!resumo[resp.questaoId][resp.valor]) resumo[resp.questaoId][resp.valor] = 0;
          resumo[resp.questaoId][resp.valor]++;
        });
      }
    });
    return resumo;
  }

  /**
   * Exporta os dados agrupados em formato CSV compatível com Excel (;)
   */
  async exportarResumoCSV(respostas: RespostaData[]): Promise<string> {
    const resumo = this.gerarResumo(respostas);
    const dadosParaCSV: DadosCSV[] = [];

    for (const questaoId in resumo) {
      for (const valor in resumo[questaoId]) {
        dadosParaCSV.push({
          Questao: questaoId,
          Resposta: valor,
          Total: resumo[questaoId][valor],
        });
      }
    }

    // Se não houver dados, retorna uma mensagem simples ou apenas o cabeçalho
    if (dadosParaCSV.length === 0) {
      return 'Nenhuma resposta encontrada para esta pesquisa.';
    }

    const fields = ['Questao', 'Resposta', 'Total'];
    
    // Atualizado com delimiter ';' para abrir direto no Excel sem erro de colunas
    const parser = new Parser({ 
      fields, 
      delimiter: ';',
      quote: '' // Remove aspas desnecessárias para limpar o visual
    }); 
    
    return parser.parse(dadosParaCSV);
  }

  /**
   * Gera um Buffer de PDF formatado com os dados da pesquisa
   */
  async exportarResumoPDF(respostas: RespostaData[]): Promise<Buffer> {
    const resumo = this.gerarResumo(respostas);

    return new Promise((resolve, reject) => {
      // Instanciação com 'as any' para evitar erro de assinatura do PDFKit no TS
      const doc = new (PDFDocument as any)({ 
        margin: 50,
        info: { Title: 'Relatório de Pesquisa' } 
      });
      
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Cabeçalho
      doc.fillColor('#1a1a1a').fontSize(20).text('Relatório de Satisfação', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).fillColor('#666666').text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, { align: 'right' });
      doc.moveDown(2);

      // Verificação de dados vazios no PDF
      if (Object.keys(resumo).length === 0) {
        doc.fontSize(12).fillColor('red').text('Nenhum dado disponível para esta pesquisa.', { align: 'center' });
      } else {
        for (const questaoId in resumo) {
          doc.fontSize(14).fillColor('#2e4053').text(`Questão: ${questaoId}`, { underline: true });
          doc.moveDown(0.5);

          for (const valor in resumo[questaoId]) {
            doc.fontSize(12).fillColor('#000000').text(`  • Resposta "${valor}": ${resumo[questaoId][valor]} ocorrência(s)`);
          }
          doc.moveDown();
          // Linha divisória
          doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#dddddd').stroke();
          doc.moveDown();
        }
      }

      doc.end();
    });
  }
}