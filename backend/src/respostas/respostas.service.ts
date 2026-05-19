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
import { AuditoriaService } from '../auditoria/auditoria.service';

import * as bcrypt from 'bcrypt';
import { generateAnonymousHash } from 'src/common/utils/hash.util';
import { Tipo } from 'src/pesquisas/pesquisa-tipo.enum';
import { ServicoService } from 'src/institutional/servico/servico.service';

@Injectable()
export class RespostasService {
  constructor(
    @InjectRepository(Resposta, 'mongo')
    private readonly repo: MongoRepository<Resposta>,

    @InjectRepository(Pesquisa, 'mongo')
    private readonly pesquisaRepo: MongoRepository<Pesquisa>,

    private readonly auditoriaService: AuditoriaService,

    private readonly servicoService: ServicoService,
  ) {}

  /**
   * Registra a resposta vinculando ao ID numérico do aluno e dispara auditoria.
   */
  async registrarIdentificado(dto: EnviarRespostaDto, usuario: any) {
    const alunoId = usuario?.userId || usuario?.id;

    if (alunoId === undefined || alunoId === null) {
      throw new BadRequestException('Identificação do aluno ausente.');
    }

    const pesquisaIdNormalizada = dto.pesquisaId.toString();

    const alunoHash = generateAnonymousHash(Number(alunoId), pesquisaIdNormalizada)

    // 1. Valida se a pesquisa existe e está aberta
    await this.validarPesquisaEPrazo(pesquisaIdNormalizada);

    // 2. Verificação de Duplicidade com busca objetiva
    const jaRespondeu = await this.repo.findOne({
      where: { alunoHash: alunoHash }
      } ,
    );

    if (jaRespondeu) {
      throw new ConflictException(
        `O aluno já enviou uma resposta para esta avaliação.`
      );
    }

    // 3. Persistência
    const novaResposta = this.repo.create({
      pesquisaId: pesquisaIdNormalizada,
      respostas: dto.respostas,
      alunoHash: alunoHash,
      enviadoEm: new Date(),
    });

    const salvo = await this.repo.save(novaResposta);

    // 4. Auditoria Silenciosa (Conforme novo protocolo)
    await this.auditoriaService.registrar({
      usuarioId: alunoHash,
      usuarioNome: usuario?.username || 'Aluno',
      entidade: 'Resposta',
      entidadeId: (salvo as any).id?.toString() || (salvo as any)._id?.toString(),
      acao: 'SUBMISSAO_RESPOSTA',
      dadosNovos: salvo,
    });

    return salvo;
  }


  async findAll() {
    return await this.repo.find({ withDeleted: true})
  }

  /**
   * Validação de estado, prazo e bloqueio de pesquisas encerradas.
   */
  private async validarPesquisaEPrazo(pesquisaId: string): Promise<Pesquisa> {
    if (!ObjectId.isValid(pesquisaId)) {
      throw new BadRequestException('ID da pesquisa possui formato inválido.');
    }

    const pesquisa = await this.pesquisaRepo.findOne({
      where: { _id: new ObjectId(pesquisaId) } as any,
    });

    if (!pesquisa) {
      throw new NotFoundException('A pesquisa solicitada não foi encontrada.');
    }

    if (!pesquisa.publicada) {
      throw new ForbiddenException('Esta pesquisa ainda não está aberta para participação.');
    }

    // Bloqueia respostas se o Cron já marcou como encerrada (RF-300)
    if (pesquisa.encerrada) {
      throw new ForbiddenException('O período de coleta de dados para esta pesquisa já foi finalizado.');
    }

    const agora = new Date();
    if (agora < new Date(pesquisa.dataInicio)) {
      throw new ForbiddenException({
        error: 'Prazo não iniciado',
        message: `Esta avaliação estará disponível apenas em ${new Date(pesquisa.dataInicio).toLocaleString('pt-BR')}`,
      });
    }

    if (agora > new Date(pesquisa.dataFinal)) {
      throw new ForbiddenException({
        error: 'Prazo encerrado',
        message: `O período de participação encerrou em ${new Date(pesquisa.dataFinal).toLocaleString('pt-BR')}`,
      });
    }

    return pesquisa;
  }

  /**
   * Gera o relatório de respostas para uma pesquisa específica.
   */
  async relatorio(pesquisaId: string) {
    if (!ObjectId.isValid(pesquisaId)) {
      throw new BadRequestException('ID da pesquisa inválido para relatório.');
    }

    return await this.repo.find({
      where: {
        $or: [
          { pesquisaId: pesquisaId.toString() },
          { pesquisaId: new ObjectId(pesquisaId) as any }
        ]
      } as any,
      order: { enviadoEm: 'DESC' },
    });
  }

  // função auxiliar de softDelete
    async softDelete(pesquisaIds: Array<string>) {

      if (!pesquisaIds || pesquisaIds.length === 0) {
        console.log("sem pesquisas para deletar as respostas")
        return
      }

      // soft delete das respostas
      await this.repo.updateMany(
        { pesquisaId: { $in: pesquisaIds } },
        { $set: { deletedAt: new Date(), updatedAt: new Date() } }
      );

      return
    }

    
    // função auxiliar de softDelete
    async softDeleteByMatricula(turmaId: number, alunoId: number) {

      const pesquisa = await this.pesquisaRepo.findOne({
        where: {
          tipo: Tipo.AVALIACAO,
          tipoId: turmaId 
        }
      });

      if (!pesquisa) return;

      const pesquisaId = pesquisa.id.toString();

      // gerar hash para apagar possível resposta
      const alunoHash = await generateAnonymousHash(alunoId, pesquisaId);

      // soft delete da resposta
      await this.repo.updateOne(
        { alunoHash: alunoHash  },
        { $set: { deletedAt: new Date(), updatedAt: new Date() } }
      );

      return
    }

    async softDeleteByAlunoCampus( alunoId: number, campusId: number) {

      // buscar APENAS os IDs de todas as pesquisas de SATISFACAO ativas daquele campus

      // buscar servicos do campus
      const servicos = await this.servicoService.servicosByCampus(campusId);

      const servicosIds = servicos.map((s) => s.id)

      const pesquisasSatisfacao = await this.pesquisaRepo.find({
        where: {
          tipo: Tipo.SATISFACAO,
          tipoId: { $in: servicosIds}, // filtro pelos servicos para limitar o escopo
          deletedAt: null
        },
        select: ['id']
      });

      if (!pesquisasSatisfacao || pesquisasSatisfacao.length === 0) {
        return; // nenhuma pesquisa encontrada, nada para deletar
      }

      // gerar a lista de hashes possíveis para este aluno
      const hashesParaDeletar = pesquisasSatisfacao.map(pesquisa => {
        const idPesquisaStr = String(pesquisa.id || (pesquisa as any).id);
        return generateAnonymousHash(alunoId, idPesquisaStr);
      });

      // soft delete em massa de todas as respostas que possuam esses hashes
      await this.repo.updateMany(
        { 
          alunoHash: { $in: hashesParaDeletar },
          deletedAt: null
        },
        { 
          $set: { 
            deletedAt: new Date(), 
            updatedAt: new Date()
          } 
        }
      );
    }

}