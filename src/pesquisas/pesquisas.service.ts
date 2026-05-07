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
import { CreateSatisfacaoDto } from './dto/create-satisfacao.dto';
import { Tipo } from './pesquisa-tipo.enum';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { TurmaService } from 'src/academic/turma/turma.service';

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

    private readonly turmaService: TurmaService
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

  async getRelatorio(id: string) {
    const pesquisa = await this.findOne(id);
    const objId = new ObjectId(id);
    
    const filter = { $or: [{ pesquisaId: id }, { pesquisaId: objId as any }, { pesquisaId: String(id) }] };
    const questoes = await this.questaoRepo.find({ where: filter as any });
    const respostas = await this.respostaRepo.find({ where: filter as any });

    return {
      pesquisa: { ...pesquisa, questoes },
      respostas,
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
      finalizada: false, // ATUALIZADO: Alinhado ao seu CreatePesquisaDto
    });
    
    const salvo = await this.repo.save(pesquisa);

    await this.auditoriaService.registrar({
      usuarioId: String(usuario?.userId || usuario?.id || 'system'),
      usuarioNome: usuario?.username || usuario?.nome || 'Admin',
      entidade: 'Pesquisa',
      entidadeId: (salvo as any).id?.toString() || (salvo as any)._id?.toString(),
      acao: 'CRIACAO_PESQUISA',
      dadosNovos: salvo
    });

    return salvo;
  }

  // função para criar pesquisa de satisfação sobre serviço
  async createSatisfacao(dto: CreateSatisfacaoDto) {

    const pesquisa = this.repo.create({
      ...dto,
      dataInicio: dto.dataInicio ? new Date(dto.dataInicio) : new Date(),
      dataFinal: new Date(dto.dataFinal),
      publicada: false, 
      tipo: Tipo.SATISFACAO,
      tipoId: dto.servicoId
    });
    return await this.repo.save(pesquisa);
  }

  // função para criar Avaliação Docente manualmente
  async createAvaliacao(dto: CreateAvaliacaoDto) {
    // verifica se a turma existe
    const turma = await this.turmaService.findOne(dto.turmaId);

    if (!turma) throw new NotFoundException("Turma não encontrada!")

    // cria data final como {fim do periodo + 180 dias}
    const dataFinal = new Date(turma?.periodo?.endDate);

    dataFinal.setDate(dataFinal.getDate() + 180)

    const pesquisa = this.repo.create({
      ...dto,
      dataInicio: dto.dataInicio ? new Date(dto.dataInicio) : new Date(),
      dataFinal: dataFinal,
      publicada: false, 
      tipo: Tipo.AVALIACAO,
      tipoId: dto.turmaId
    });
    return await this.repo.save(pesquisa);
  }

  async update(id: string, dto: Partial<CreatePesquisaDto>, usuario: any) {
    const pesquisaAtual = await this.findOne(id);
    
    // Proteção contra body vazio ou nulo
    const camposEditados = Object.keys(dto || {});
    if (camposEditados.length === 0) {
      return { message: 'Nenhuma alteração detectada' };
    }

    if (pesquisaAtual.publicada) {
      const apenasDataFinal = camposEditados.length === 1 && camposEditados[0] === 'dataFinal';
      
      if (!apenasDataFinal) {
        throw new ForbiddenException('Apenas o prazo final de pesquisas publicadas pode ser editado.');
      }
    }

    // Auditoria de prazo com proteção adicional de nulidade
    if (dto.dataFinal && pesquisaAtual.dataFinal) {
      const novaData = new Date(dto.dataFinal).getTime();
      const dataAntiga = new Date(pesquisaAtual.dataFinal).getTime();

      if (novaData !== dataAntiga) {
        await this.auditoriaService.registrar({
          usuarioId: String(usuario?.userId || usuario?.id || 'system'),
          usuarioNome: usuario?.username || usuario?.nome || 'Admin',
          entidade: 'Pesquisa',
          entidadeId: id,
          acao: 'ALTERACAO_PRAZO',
          dadosAnteriores: { dataFinal: pesquisaAtual.dataFinal },
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
    await this.repo.updateOne({ _id: new ObjectId(id) }, { $set: { publicada: true } });

    await this.auditoriaService.registrar({
      usuarioId: String(usuario?.userId || usuario?.id || 'system'),
      usuarioNome: usuario?.username || usuario?.nome || 'Admin',
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
    const filter = { $or: [{ pesquisaId: id }, { pesquisaId: objId as any }] };

    await this.respostaRepo.deleteMany(filter as any);
    await this.questaoRepo.deleteMany(filter as any);
    await this.repo.deleteOne({ _id: objId });

    await this.auditoriaService.registrar({
      usuarioId: String(usuario?.userId || usuario?.id || 'system'),
      usuarioNome: usuario?.username || usuario?.nome || 'Admin',
      entidade: 'Pesquisa',
      entidadeId: id,
      acao: 'REMOVER_PESQUISA',
      dadosAnteriores: { titulo: pesquisa.titulo }
    });

    return { message: 'Pesquisa removida' };
  }
}