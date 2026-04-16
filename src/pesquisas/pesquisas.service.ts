import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pesquisa } from './entities/pesquisa.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';

// Importação das entidades para os repositórios injetados
import { Questao } from '../questoes/entities/questao.entity';
import { Resposta } from '../respostas/entities/resposta.entity';

@Injectable()
export class PesquisasService {
  constructor(
    @InjectRepository(Pesquisa, 'mongo')
    private readonly repo: MongoRepository<Pesquisa>,

    @InjectRepository(Questao, 'mongo')
    private readonly questaoRepo: MongoRepository<Questao>,

    @InjectRepository(Resposta, 'mongo')
    private readonly respostaRepo: MongoRepository<Resposta>,
  ) {}

  // Criar nova pesquisa (Admin)
  async create(dto: CreatePesquisaDto) {
    const pesquisa = this.repo.create({
      ...dto,
      publicada: false,
    });
    return this.repo.save(pesquisa);
  }

  // Listar todas as pesquisas (Admin)
  async findAll() {
    return await this.repo.find({
      order: { _id: 'DESC' },
    });
  }

  // Buscar uma pesquisa específica (Público/Admin)
  async findOne(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }

    const pesquisa = await this.repo.findOneBy({
      _id: new ObjectId(id),
    });

    if (!pesquisa) {
      throw new NotFoundException('Pesquisa não encontrada');
    }
    return pesquisa;
  }

  // 🟢 NOVO: Atualizar pesquisa (Admin) - Com Trava de Segurança
  async update(id: string, dto: Partial<CreatePesquisaDto>) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }

    const pesquisaAtual = await this.repo.findOneBy({ _id: new ObjectId(id) });

    if (!pesquisaAtual) {
      throw new NotFoundException('Pesquisa não encontrada');
    }

    // Dica de Ouro: Bloqueia edição se já estiver publicada
    if (pesquisaAtual.publicada) {
      throw new BadRequestException(
        'Esta pesquisa já foi publicada e não pode mais ser editada para garantir a integridade dos dados coletados.',
      );
    }

    await this.repo.updateOne(
      { _id: new ObjectId(id) },
      { $set: dto },
    );

    return { 
      message: 'Pesquisa atualizada com sucesso',
      camposAlterados: Object.keys(dto)
    };
  }

  // Publicar uma pesquisa (Admin)
  async publicar(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }

    const result = await this.repo.updateOne(
      { _id: new ObjectId(id) },
      { $set: { publicada: true } },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('Pesquisa não encontrada');
    }

    return { message: 'Pesquisa publicada com sucesso' };
  }

  // Deletar pesquisa com cascata (Admin)
  async remove(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('ID da pesquisa inválido');
    }

    await this.respostaRepo.deleteMany({ pesquisaId: id });
    await this.questaoRepo.deleteMany({ pesquisaId: id });

    const result = await this.repo.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Pesquisa não encontrada para remover');
    }

    return {
      message: 'Pesquisa e todos os dados vinculados removidos com sucesso.',
      idDeletado: id,
    };
  }
}