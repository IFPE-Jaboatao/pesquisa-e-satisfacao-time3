import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Questao } from './entities/questao.entity';
import { Pesquisa } from '../pesquisas/entities/pesquisa.entity';
import { MongoRepository, ObjectLiteral } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreateQuestaoDto } from './dto/create-questao.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';

@Injectable()
export class QuestoesService {
  constructor(
    @InjectRepository(Questao, 'mongo')
    private readonly repo: MongoRepository<Questao>,

    @InjectRepository(Pesquisa, 'mongo')
    private readonly pesquisaRepo: MongoRepository<Pesquisa>,

    private readonly auditoriaService: AuditoriaService,
  ) {}

  async create(dto: CreateQuestaoDto, usuario: any) {
    if (!ObjectId.isValid(dto.pesquisaId)) {
      throw new BadRequestException('ID da pesquisa inválido');
    }

    const pesquisa = await this.pesquisaRepo.findOne({
      where: { _id: new ObjectId(dto.pesquisaId) } as any,
    });

    if (!pesquisa) {
      throw new NotFoundException('Pesquisa não encontrada');
    }

    const questao = this.repo.create(dto);
    const salvo = await this.repo.save(questao);

    // Auditoria silenciosa para rastreabilidade no MongoDB
    await this.auditoriaService.registrar({
      usuarioId: String(usuario?.userId || usuario?.id || 'sistema'),
      usuarioNome: usuario?.username || 'Admin',
      entidade: 'Questao',
      entidadeId: (salvo as any).id?.toString() || (salvo as any)._id?.toString(),
      acao: 'CRIACAO_QUESTAO',
      dadosNovos: salvo,
    });

    return salvo;
  }

  // função auxiliar para criação de perguntas com várias questões
  async createMany(questoes: CreateQuestaoDto[]) {
    const result = await this.repo.insertMany(questoes, {ordered: true})

    return result
  }

  async findByPesquisa(pesquisaId: string) {
    if (!ObjectId.isValid(pesquisaId)) {
      throw new BadRequestException('ID inválido');
    }

    // Busca flexível para garantir que encontre a questão independente do formato do ID salvo
    const questoes = await this.repo.find({
      where: {
        pesquisaId: pesquisaId 
      } as any,
    });

    return questoes; // Removido o throw para permitir que relatórios venham vazios sem quebrar o fluxo
  }

  // função auxiliar de softDelete
    async softDelete(pesquisaIds: Array<string>) {

      if (!pesquisaIds || pesquisaIds.length === 0) {
        console.log("sem pesquisas para deletar as questoes")
        return
      }

      // soft delete das questoes
      await this.repo.updateMany(
        { pesquisaId: { $in: pesquisaIds } },
        { $set: { deletedAt: new Date(), updatedAt: new Date() } }
      );

      return
    }
}