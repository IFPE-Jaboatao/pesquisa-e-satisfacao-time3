import { Injectable } from '@nestjs/common';

@Injectable()
export class RelatoriosService {
  gerarResumo(respostas: any[]) {
    const resumo: any = {};

    respostas.forEach((r) => {
      r.respostas.forEach((resp) => {
        if (!resumo[resp.questaoId]) {
          resumo[resp.questaoId] = {};
        }

        if (!resumo[resp.questaoId][resp.valor]) {
          resumo[resp.questaoId][resp.valor] = 0;
        }

        resumo[resp.questaoId][resp.valor]++;
      });
    });

    return resumo;
  }
}