import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { Resposta } from './entities/resposta.entity';
import { Pesquisa } from '../pesquisas/entities/pesquisa.entity';
import { EnviarRespostaDto } from './dto/enviar-resposta.dto';

@Injectable()
export class RespostasService {
  constructor(
    @InjectRepository(Resposta, 'mongo')
    private readonly repo: MongoRepository<Resposta>,

    @InjectRepository(Pesquisa, 'mongo')
    private readonly pesquisaRepo: MongoRepository<Pesquisa>,
  ) {}

  /**
   * Registra uma nova resposta validando prazos e duplicidade
   */
  async registrar(dto: EnviarRespostaDto, user: any) {
    // 1. Validação de existência da pesquisa
    if (!ObjectId.isValid(dto.pesquisaId)) {
      throw new BadRequestException('ID da pesquisa inválido.');
    }

    const pesquisa = await this.pesquisaRepo.findOne({
      where: { _id: new ObjectId(dto.pesquisaId) } as any,
    });

    if (!pesquisa) {
      throw new NotFoundException('Pesquisa não encontrada.');
    }

    // --- LÓGICA DE PRAZO (VIGÊNCIA) ---
    const agora = new Date();
    const dataInicio = new Date(pesquisa.dataInicio);
    const dataFinal = new Date(pesquisa.dataFinal);

    if (isNaN(dataInicio.getTime()) || isNaN(dataFinal.getTime())) {
      throw new BadRequestException('As datas da pesquisa estão em formato inválido no banco de dados.');
    }

    if (agora < dataInicio) {
      throw new ForbiddenException({
        error: 'Prazo não iniciado',
        message: `Esta pesquisa só aceitará respostas a partir de ${dataInicio.toLocaleString()}`,
        status: 'FUTURE_START',
      });
    }

    if (agora > dataFinal) {
      throw new ForbiddenException({
        error: 'Prazo encerrado',
        message: `O período de participação terminou em ${dataFinal.toLocaleString()}`,
        status: 'EXPIRED',
      });
    }

    // 2. Verificação de Publicação
    if (!pesquisa.publicada) {
      throw new ForbiddenException('Esta pesquisa ainda não foi publicada para o público.');
    }

    // 3. Anti-Fraude (AnonId e Fingerprint)
    const jaRespondeu = await this.repo.findOne({
      where: {
        pesquisaId: dto.pesquisaId,
        $or: [
          { anonId: user.anonId },
          { fingerprint: user.fingerprint }
        ]
      } as any,
    });

    if (jaRespondeu) {
      throw new ConflictException('Você já enviou uma resposta para esta pesquisa.');
    }

    // 4. Persistência da Resposta
    const novaResposta = this.repo.create({
      ...dto,
      enviadoEm: agora,
      anonId: user.anonId,
      fingerprint: user.fingerprint,
    });

    return await this.repo.save(novaResposta);
  }

  /**
   * Método exigido pelos Controllers para listar respostas de uma pesquisa
   * Resolve os erros TS2339 no RelatoriosController e RespostasController
   */
  async relatorio(pesquisaId: string) {
    if (!ObjectId.isValid(pesquisaId)) {
      throw new BadRequestException('ID da pesquisa inválido.');
    }

    const respostas = await this.repo.find({
      where: { pesquisaId: pesquisaId } as any,
      order: { enviadoEm: 'DESC' }
    });

    if (!respostas || respostas.length === 0) {
      throw new NotFoundException('Nenhuma resposta encontrada para esta pesquisa.');
    }

    return respostas;
  }
}