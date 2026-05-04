import { 
  Injectable, 
  BadRequestException, 
  NotFoundException, 
  ForbiddenException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pesquisa } from './entities/pesquisa.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { Questao } from '../questoes/entities/questao.entity';
import { Resposta } from '../respostas/entities/resposta.entity';
import { AuditoriaService } from '../auditoria/auditoria.service';

@Injectable()
export class PesquisasService {
  constructor(
    @InjectRepository(Pesquisa, 'mongo')
    private readonly repo: MongoRepository<Pesquisa>,

    @InjectRepository(Questao, 'mongo')
    private readonly questaoRepo: MongoRepository<Questao>,

    @InjectRepository(Resposta, 'mongo')
    private readonly respostaRepo: MongoRepository<Resposta>,

    private readonly auditoriaService: AuditoriaService,
  ) {}

  async findAll() {
    return await this.repo.find({ order: { _id: 'DESC' } });
  }

  async findAllByTurma(turmaId: number) {
    return await this.repo.find({ 
      where: { turmaId: turmaId },
      order: { _id: 'DESC' } 
    });
  }

  async findOne(id: string) {
    if (!id || !ObjectId.isValid(id)) {
      throw new BadRequestException('ID com formato inválido ou ausente');
    }
    
    const pesquisa = await this.repo.findOne({ 
      where: { _id: new ObjectId(id) } as any 
    });

    if (!pesquisa) {
      throw new NotFoundException(`Pesquisa com ID ${id} não encontrada`);
    }
    return pesquisa;
  }

  /**
   * CORREÇÃO CRÍTICA: Busca questões e respostas garantindo compatibilidade de tipos de ID.
   */
  async getRelatorio(id: string) {
    const pesquisa = await this.findOne(id);
    const objId = new ObjectId(id);
    
    const questoes = await this.questaoRepo.find({ 
      where: { 
        $or: [
          { pesquisaId: id },
          { pesquisaId: objId as any },
          { pesquisaId: String(id) }
        ]
      } as any
    });

    const respostas = await this.respostaRepo.find({ 
      where: { 
        $or: [
          { pesquisaId: id },
          { pesquisaId: objId as any },
          { pesquisaId: String(id) }
        ]
      } as any
    });

    const pesquisaCompleta = {
      ...pesquisa,
      questoes: questoes 
    };

    return {
      pesquisa: pesquisaCompleta,
      respostas: respostas,
      titulo: pesquisa.titulo,
      estatisticas: {
        totalQuestoes: questoes.length,
        totalParticipantes: respostas.length,
      }
    };
  }

  async create(dto: CreatePesquisaDto, usuario: any) {
    const pesquisa = this.repo.create({
      ...dto,
      dataInicio: dto.dataInicio ? new Date(dto.dataInicio) : new Date(),
      dataFinal: dto.dataFinal ? new Date(dto.dataFinal) : new Date(),
      publicada: false, 
    });
    
    const salvo = await this.repo.save(pesquisa);

    // CORREÇÃO DE TIPAGEM: Usamos o cast 'as any' para acessar o _id sem mexer na Entity
    await this.auditoriaService.registrar({
      usuarioId: String(usuario?.userId || usuario?.id || 'system'),
      usuarioNome: usuario?.username || 'Admin',
      entidade: 'Pesquisa',
      entidadeId: (salvo as any)._id ? (salvo as any)._id.toString() : (salvo as any).id?.toString(),
      acao: 'CRIACAO_PESQUISA',
      dadosNovos: salvo
    });

    return salvo;
  }

  async update(id: string, dto: Partial<CreatePesquisaDto>, usuario: any) {
    const pesquisaAtual = await this.findOne(id);
    const isPublicada = pesquisaAtual?.publicada;
    const dataFinalOriginal = pesquisaAtual?.dataFinal;

    if (isPublicada === true) {
      const camposEditados = Object.keys(dto);
      const apenasDataFinal = camposEditados.length === 1 && camposEditados[0] === 'dataFinal';
      
      if (!apenasDataFinal && camposEditados.length > 0) {
        throw new ForbiddenException('Apenas o prazo final de pesquisas publicadas pode ser editado.');
      }
    }

    if (dto.dataFinal && dataFinalOriginal) {
      if (new Date(dto.dataFinal).getTime() !== new Date(dataFinalOriginal).getTime()) {
        await this.auditoriaService.registrar({
          usuarioId: String(usuario?.userId || usuario?.id || 'system'),
          usuarioNome: usuario?.username || 'Admin',
          entidade: 'Pesquisa',
          entidadeId: id,
          acao: 'ALTERACAO_PRAZO',
          dadosAnteriores: { dataFinal: dataFinalOriginal },
          dadosNovos: { dataFinal: dto.dataFinal }
        });
      }
    }

    const updateData: any = { ...dto };
    if (dto.dataInicio) updateData.dataInicio = new Date(dto.dataInicio);
    if (dto.dataFinal) updateData.dataFinal = new Date(dto.dataFinal);

    await this.repo.updateOne(
      { _id: new ObjectId(id) }, 
      { $set: updateData }
    );
    
    return { message: 'Atualização concluída com sucesso' };
  }

  async publicar(id: string, usuario: any) {
    await this.findOne(id);

    await this.repo.updateOne(
      { _id: new ObjectId(id) },
      { $set: { publicada: true } }
    );

    await this.auditoriaService.registrar({
      usuarioId: String(usuario?.userId || usuario?.id || 'system'),
      usuarioNome: usuario?.username || 'Admin',
      entidade: 'Pesquisa',
      entidadeId: id,
      acao: 'PUBLICAR_PESQUISA',
      dadosNovos: { publicada: true }
    });

    return { message: 'Pesquisa publicada' };
  }

  async remove(id: string, usuario: any) {
    const pesquisa = await this.findOne(id);
    const objId = new ObjectId(id);

    await this.respostaRepo.deleteMany({ 
      $or: [{ pesquisaId: id }, { pesquisaId: objId as any }] 
    } as any);

    await this.questaoRepo.deleteMany({ 
      $or: [{ pesquisaId: id }, { pesquisaId: objId as any }] 
    } as any);

    await this.repo.deleteOne({ _id: objId });

    await this.auditoriaService.registrar({
      usuarioId: String(usuario?.userId || usuario?.id || 'system'),
      usuarioNome: usuario?.username || 'Admin',
      entidade: 'Pesquisa',
      entidadeId: id,
      acao: 'REMOVER_PESQUISA',
      dadosAnteriores: { titulo: pesquisa.titulo }
    });

    return { message: 'Pesquisa removida' };
  }
}