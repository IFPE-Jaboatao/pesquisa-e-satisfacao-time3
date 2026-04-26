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
    
    // Busca flexível: tenta encontrar pelo _id nativo do Mongo
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
    const questoes = await this.questaoRepo.find({ where: { pesquisaId: id } });
    const todasRespostas = await this.respostaRepo.find({ where: { pesquisaId: id } });

    const relatorioQuestoes = questoes.map((q: any) => {
      const questaoIdStr = q.id ? q.id.toString() : q._id?.toString();

      const respostasDestaQuestao = todasRespostas
        .map(doc => doc.respostas?.find(item => item.questaoId === questaoIdStr))
        .filter(item => item !== undefined);

      const frequencia = respostasDestaQuestao.reduce((acc, curr) => {
        const valor = curr.valor || "Sem Resposta";
        acc[valor] = (acc[valor] || 0) + 1;
        return acc;
      }, {});

      return {
        questaoId: questaoIdStr,
        enunciado: q.pergunta || q.enunciado || "Questão sem título",
        tipo: q.tipo,
        totalRespostas: respostasDestaQuestao.length,
        dados: Object.keys(frequencia).map(chave => ({
          label: chave,
          valor: frequencia[chave]
        }))
      };
    });

    return {
      titulo: pesquisa.titulo,
      publicada: pesquisa.publicada,
      turmaId: pesquisa.turmaId,
      estatisticas: {
        totalQuestoes: questoes.length,
        totalParticipantes: todasRespostas.length,
      },
      detalhes: relatorioQuestoes,
    };
  }

  async create(dto: CreatePesquisaDto) {
    const pesquisa = this.repo.create({
      ...dto,
      dataInicio: dto.dataInicio ? new Date(dto.dataInicio) : new Date(),
      dataFinal: dto.dataFinal ? new Date(dto.dataFinal) : new Date(),
      publicada: false,
    });
    return await this.repo.save(pesquisa);
  }

  async update(id: string, dto: Partial<CreatePesquisaDto>, usuario: any) {
    // 1. Garante que a pesquisa existe antes de qualquer lógica
    const pesquisaAtual = await this.findOne(id);

    // 2. Extração segura de campos (Tratando a inconsistência do banco)
    const isPublicada = pesquisaAtual?.publicada || pesquisaAtual['publicada'];
    const dataFinalOriginal = pesquisaAtual?.dataFinal || pesquisaAtual['dataFinal'];

    // 3. Validação de bloqueio para pesquisas publicadas
    if (isPublicada === true) {
      const camposEditados = Object.keys(dto);
      const apenasDataFinal = camposEditados.length === 1 && camposEditados[0] === 'dataFinal';
      
      if (!apenasDataFinal && camposEditados.length > 0) {
        throw new ForbiddenException(
          'Pesquisa já publicada. Apenas o prazo final pode ser editado.'
        );
      }
    }

    // 4. Auditoria protegida (Resolve o Erro 500 na comparação de dataFinal)
    if (dto.dataFinal && dataFinalOriginal) {
      const novoTempo = new Date(dto.dataFinal).getTime();
      const antigoTempo = new Date(dataFinalOriginal).getTime();

      if (novoTempo !== antigoTempo) {
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

    // 5. Preparação dos dados para o Mongo
    const updateData: any = { ...dto };
    if (dto.dataInicio) updateData.dataInicio = new Date(dto.dataInicio);
    if (dto.dataFinal) updateData.dataFinal = new Date(dto.dataFinal);

    // 6. Update usando o _id nativo para garantir consistência
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

    await this.respostaRepo.deleteMany({ pesquisaId: id });
    await this.questaoRepo.deleteMany({ pesquisaId: id });
    await this.repo.deleteOne({ _id: new ObjectId(id) });

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