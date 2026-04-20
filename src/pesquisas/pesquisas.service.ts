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

// Importações para o Relatório e Auditoria
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

  async create(dto: CreatePesquisaDto) {
    const pesquisa = this.repo.create({
      ...dto,
      publicada: false,
    });
    return this.repo.save(pesquisa);
  }

  async findAll() {
    return await this.repo.find({ order: { _id: 'DESC' } });
  }

  async findOne(id: string) {
    if (!ObjectId.isValid(id)) throw new BadRequestException('ID inválido');
    const pesquisa = await this.repo.findOneBy({ _id: new ObjectId(id) });
    if (!pesquisa) throw new NotFoundException('Pesquisa não encontrada');
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
        enunciado: q.texto || q.enunciado || "Questão sem título",
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
      estatisticas: {
        totalQuestoes: questoes.length,
        totalParticipantes: todasRespostas.length,
      },
      detalhes: relatorioQuestoes,
    };
  }

  async update(id: string, dto: Partial<CreatePesquisaDto>, usuario: any) {
    const pesquisaAtual = await this.findOne(id);

    if (pesquisaAtual.publicada) {
      const camposProibidos = Object.keys(dto).filter(campo => campo !== 'dataFinal');
      if (camposProibidos.length > 0) {
        throw new ForbiddenException(`Apenas 'dataFinal' pode ser alterada em pesquisas publicadas.`);
      }
    }

    if (dto.dataFinal) {
      const tempoNovo = new Date(dto.dataFinal).getTime();
      const tempoAntigo = new Date(pesquisaAtual.dataFinal).getTime();

      if (tempoNovo !== tempoAntigo) {
        await this.auditoriaService.registrar({
          // CONFIGURAÇÃO DE BACKUP AQUI
          usuarioId: String(usuario?.sub || usuario?.userId || usuario?.id || 'null'),
          usuarioNome: usuario?.username || usuario?.nome || usuario?.name || 'Usuário Desconhecido',
          entidade: 'Pesquisa',
          entidadeId: id,
          acao: 'ALTERACAO_PRAZO',
          dadosAnteriores: { dataFinal: pesquisaAtual.dataFinal },
          dadosNovos: { dataFinal: dto.dataFinal }
        });
      }
    }

    await this.repo.updateOne({ _id: new ObjectId(id) }, { $set: dto });
    return { message: 'Pesquisa atualizada com sucesso', alteracoes: Object.keys(dto) };
  }

  async publicar(id: string, usuario: any) {
    const result = await this.repo.updateOne(
      { _id: new ObjectId(id) },
      { $set: { publicada: true } }
    );

    if (result.matchedCount === 0) throw new NotFoundException('Pesquisa não encontrada');

    await this.auditoriaService.registrar({
      usuarioId: String(usuario?.sub || usuario?.userId || usuario?.id || 'null'),
      usuarioNome: usuario?.username || usuario?.nome || usuario?.name || 'Usuário Desconhecido',
      entidade: 'Pesquisa',
      entidadeId: id,
      acao: 'PUBLICAR_PESQUISA',
      dadosNovos: { publicada: true }
    });

    return { message: 'Pesquisa publicada com sucesso' };
  }

  async remove(id: string, usuario: any) {
    const pesquisa = await this.findOne(id);

    await this.respostaRepo.deleteMany({ pesquisaId: id });
    await this.questaoRepo.deleteMany({ pesquisaId: id });
    const result = await this.repo.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      await this.auditoriaService.registrar({
        usuarioId: String(usuario?.sub || usuario?.userId || usuario?.id || 'null'),
        usuarioNome: usuario?.username || usuario?.nome || usuario?.name || 'Usuário Desconhecido',
        entidade: 'Pesquisa',
        entidadeId: id,
        acao: 'REMOVER_PESQUISA',
        dadosAnteriores: { titulo: pesquisa.titulo }
      });
    }

    return { message: 'Pesquisa e dados vinculados removidos.' };
  }
}