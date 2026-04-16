import {
  Injectable,
  BadRequestException,
  NotFoundException,
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

  async registrar(dto: EnviarRespostaDto, user: any) {
    // 1. Valida se o interceptor/middleware injetou os dados anônimos
    if (!user?.anonId || !user?.fingerprint) {
      throw new BadRequestException('Identificação do usuário (anonId/fingerprint) não encontrada.');
    }

    // 2. Valida o formato do ID da pesquisa
    if (!ObjectId.isValid(dto.pesquisaId)) {
      throw new BadRequestException('ID da pesquisa com formato inválido.');
    }

    // 3. Busca a pesquisa garantindo o uso de ObjectId
    const pesquisa = await this.pesquisaRepo.findOne({
      where: { _id: new ObjectId(dto.pesquisaId) }
    });

    if (!pesquisa) {
      throw new NotFoundException('A pesquisa solicitada não existe.');
    }

    if (!pesquisa.publicada) {
      throw new BadRequestException('Esta pesquisa ainda não foi publicada.');
    }

    // 4. Correção de Datas: Converte strings do banco para objetos Date antes de comparar
    const agora = new Date();
    const dataInicio = new Date(pesquisa.dataInicio);
    const dataFinal = new Date(pesquisa.dataFinal);

    if (agora < dataInicio || agora > dataFinal) {
      throw new BadRequestException('A pesquisa não está no período de vigência.');
    }

    // 5. Anti-Fraude: Verifica duplicidade usando os campos únicos
    const [jaRespondeuAnon, jaRespondeuFingerprint] = await Promise.all([
      this.repo.findOne({
        where: {
          pesquisaId: dto.pesquisaId,
          anonId: user.anonId,
        },
      }),
      this.repo.findOne({
        where: {
          pesquisaId: dto.pesquisaId,
          fingerprint: user.fingerprint,
        },
      }),
    ]);

    if (jaRespondeuAnon || jaRespondeuFingerprint) {
      throw new BadRequestException('Participação já registrada para este usuário nesta pesquisa.');
    }

    // 6. Criação do registro
    const novaResposta = this.repo.create({
      ...dto,
      enviadoEm: agora,
      anonId: user.anonId,
      fingerprint: user.fingerprint,
    });

    return await this.repo.save(novaResposta);
  }

  async relatorio(pesquisaId: string) {
    if (!ObjectId.isValid(pesquisaId)) {
      throw new BadRequestException('ID da pesquisa inválido.');
    }

    const respostas = await this.repo.find({
      where: { pesquisaId: pesquisaId }, 
    });

    if (!respostas || respostas.length === 0) {
      throw new NotFoundException('Ainda não existem respostas para esta pesquisa.');
    }

    return respostas;
  }
}