import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Pesquisa } from './entities/pesquisa.entity';
import { Resposta } from '../respostas/entities/resposta.entity'; 
import { MailService } from '../mail/mail.service';

@Injectable()
export class PesquisasCronService {
  private readonly logger = new Logger(PesquisasCronService.name);

  constructor(
    private readonly mailService: MailService,
    @InjectRepository(Pesquisa, 'mongo')
    private readonly pesquisaRepository: MongoRepository<Pesquisa>,
    @InjectRepository(Resposta, 'mongo')
    private readonly respostaRepository: MongoRepository<Resposta>,
  ) {}

  @Cron('0 0 0 * * *')
  async gerenciarCicloDeVidaPesquisas() {
    const hoje = new Date();
    this.logger.log(`Iniciando processamento diário às ${hoje.toISOString()}`);
    
    await this.processarAberturas(hoje);
    await this.processarLembretes(hoje);
    await this.processarEncerramentos(hoje);
  }

  private async processarAberturas(hoje: Date) {
    const pesquisasParaAbrir = await this.pesquisaRepository.find({
      where: {
        publicada: true,
        notificacaoAberturaEnviada: { $ne: true } as any,
        dataInicio: { $lte: hoje } as any,
      }
    });

    for (const pesquisa of pesquisasParaAbrir) {
      await this.mailService.enviarNotificacao('NOVA_PESQUISA', {
        emailDestinatario: 'alunos@ifpe.edu.br',
        titulo: pesquisa.titulo,
        assunto: pesquisa.assunto,
        dataFinal: pesquisa.dataFinal,
        link: `https://survey-system.ifpe.edu.br/responder/${pesquisa.id}`,
      });

      pesquisa.notificacaoAberturaEnviada = true;
      await this.pesquisaRepository.save(pesquisa);
    }
  }

  private async processarLembretes(hoje: Date) {
    const pesquisasAtivas = await this.pesquisaRepository.find({
      where: {
        publicada: true,
        encerrada: false,
        dataFinal: { $gte: hoje } as any 
      }
    });

    for (const pesquisa of pesquisasAtivas) {
      // CORREÇÃO: Trava para evitar loop de e-mails no mesmo dia
      if (pesquisa.dataUltimoLembrete && 
          new Date(pesquisa.dataUltimoLembrete).toDateString() === hoje.toDateString()) {
        continue;
      }

      const respostasExistentes = await this.respostaRepository.find({
        where: { pesquisaId: pesquisa.id.toString() }
      });
      
      const idsQueJaResponderam = respostasExistentes.map(r => r.alunoId);

      const alunosAlvo = [
        { id: 1, email: 'matheus7778842@gmail.com' },
        { id: 2, email: '' }
      ];

      let houveEnvio = false;
      for (const aluno of alunosAlvo) {
        if (!idsQueJaResponderam.includes(aluno.id)) {
          await this.mailService.enviarNotificacao('LEMBRETE_FIM', {
            emailDestinatario: aluno.email,
            titulo: pesquisa.titulo,
            dataFinal: pesquisa.dataFinal,
            link: `https://survey-system.ifpe.edu.br/responder/${pesquisa.id}`,
          });
          houveEnvio = true;
        }
      }

      // CORREÇÃO: Persiste a data para bloquear o próximo ciclo do Cron hoje
      if (houveEnvio) {
        pesquisa.dataUltimoLembrete = hoje;
        await this.pesquisaRepository.save(pesquisa);
      }
    }
  }

  private async processarEncerramentos(hoje: Date) {
    const pesquisasParaEncerrar = await this.pesquisaRepository.find({
      where: {
        dataFinal: { $lt: hoje } as any,
        encerrada: { $ne: true } as any,
      }
    });

    for (const pesquisa of pesquisasParaEncerrar) {
      pesquisa.encerrada = true;
      await this.pesquisaRepository.save(pesquisa);

      const destinatarios = [pesquisa.emailDocente, 'gestor@ifpe.edu.br'].filter(e => !!e);

      for (const email of destinatarios) {
        await this.mailService.enviarNotificacao('RESULTADO_DISPONIVEL', {
          emailDestinatario: email,
          titulo: pesquisa.titulo,
          assunto: pesquisa.assunto || pesquisa.titulo,
          link: `https://survey-system.ifpe.edu.br/relatorios/${pesquisa.id}`,
        });
      }
    }
  }
}