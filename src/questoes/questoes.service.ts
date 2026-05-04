import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Questao } from './entities/questao.entity';
import { Pesquisa } from '../pesquisas/entities/pesquisa.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreateQuestaoDto } from './dto/create-questao.dto';
import { AuditoriaService } from '../auditoria/auditoria.service'; // IMPORTANTE

@Injectable()
export class QuestoesService {
  constructor(
    @InjectRepository(Questao, 'mongo')
    private readonly repo: MongoRepository<Questao>,

    @InjectRepository(Pesquisa, 'mongo')
    private readonly pesquisaRepo: MongoRepository<Pesquisa>,

    private readonly auditoriaService: AuditoriaService, // INJEÇÃO NECESSÁRIA
  ) {}

  async create(dto: CreateQuestaoDto, usuario: any) { // RECEBE O USUÁRIO
    // valida pesquisaId
    if (!ObjectId.isValid(dto.pesquisaId)) {
      throw new BadRequestException('ID da pesquisa inválido');
    }

    const pesquisa = await this.pesquisaRepo.findOneBy({
      _id: new ObjectId(dto.pesquisaId),
    });

    if (!pesquisa) {
      throw new NotFoundException('Pesquisa não encontrada');
    }

    const questao = this.repo.create(dto);
    const salvo = await this.repo.save(questao);

    // DISPARO DA AUDITORIA (Ativa o NotificacoesService e o e-mail)
    await this.auditoriaService.registrar({
      usuarioId: String(usuario?.userId || usuario?.id || 'sistema'),
      usuarioNome: usuario?.username || 'Admin',
      entidade: 'Questao',
      entidadeId: (salvo as any)._id?.toString(),
      acao: 'CRIACAO_QUESTAO',
      dadosNovos: salvo,
    });

    return salvo;
  }

  async findByPesquisa(pesquisaId: string) {
    // valida ID
    if (!ObjectId.isValid(pesquisaId)) {
      throw new BadRequestException('ID inválido');
    }

    const questoes = await this.repo.find({
      where: { pesquisaId },
    });

    if (!questoes.length) {
      throw new NotFoundException('Nenhuma questão encontrada');
    }

    return questoes;
  }
}