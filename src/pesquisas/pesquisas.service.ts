import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConsoleLogger,
  HttpCode,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pesquisa } from './entities/pesquisa.entity';
import { MongoRepository, Not, ObjectLiteral } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreatePesquisaDto } from './dto/create-pesquisa.dto';
import { Questao, TipoQuestao } from '../questoes/entities/questao.entity';
import { Resposta } from '../respostas/entities/resposta.entity';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { CreateSatisfacaoDto } from './dto/create-satisfacao.dto';
import { Tipo } from './pesquisa-tipo.enum';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { TurmaService } from 'src/academic/turma/turma.service';
import { CreateAvaliacaoPeriodoDto } from './dto/create-avaliacao-periodo.dto';
import { QuestoesService } from 'src/questoes/questoes.service';
import { CRITERIOS } from './perguntas-criterios.dict';
import { CreateQuestaoDto } from 'src/questoes/dto/create-questao.dto';
import { error } from 'console';
import { Status } from './pesquisa-status.enum';
import { ServicoService } from 'src/institutional/servico/servico.service';

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

    private readonly turmaService: TurmaService,

    private readonly questoesService: QuestoesService,

    private readonly servicoService: ServicoService,
  ) {}

  async findAll() {
    return await this.repo.find({ order: { _id: 'DESC' } });
  }

  async findAllByTurma(turmaId: number) {
    return await this.repo.find({
      where: { turmaId: turmaId },
      order: { _id: 'DESC' },
    });
  }

  async findOne(id: string) {
    if (!id || !ObjectId.isValid(id)) {
      throw new BadRequestException('ID com formato inválido ou ausente');
    }

    const pesquisa = await this.repo.findOne({
      where: { _id: new ObjectId(id) } as any,
    });

    if (!pesquisa) {
      throw new NotFoundException(`Pesquisa com ID ${id} não encontrada`);
    }
    return pesquisa;
  }

  async getRelatorio(id: string) {
    const pesquisa = await this.findOne(id);
    const objId = new ObjectId(id);

    const filter = {
      $or: [
        { pesquisaId: id },
        { pesquisaId: objId as any },
        { pesquisaId: String(id) },
      ],
    };
    const questoes = await this.questaoRepo.find({ where: filter as any });
    const respostas = await this.respostaRepo.find({ where: filter as any });

    return {
      pesquisa: { ...pesquisa, questoes },
      respostas,
      titulo: pesquisa.titulo,
      estatisticas: {
        totalQuestoes: questoes.length,
        totalParticipantes: respostas.length,
      },
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
      entidadeId:
        (salvo as any).id?.toString() || (salvo as any)._id?.toString(),
      acao: 'CRIACAO_PESQUISA',
      dadosNovos: salvo,
    });

    return salvo;
  }

  // função para criar pesquisa de satisfação sobre serviço
  async createSatisfacao(dto: CreateSatisfacaoDto, campusId: number) {
    
    // pesquisas não podem começar no passado
    if (dto.dataInicio) {
      const dateCheck =
        new Date(dto.dataInicio).toLocaleDateString() >= new Date().toLocaleDateString();

      if (!dateCheck)
        throw new BadRequestException(
          'Data início deve ser maior ou igual a hoje!',
        );
    }

    // verificar se serviço existe
    const servico = await this.servicoService.findOne(dto.servicoId);

    if (!servico) throw new NotFoundException('Serviço não encontrado!');

    // verificar se o gestor é do mesmo campus que o serviço
    if (servico.campus?.id !== campusId) throw new UnauthorizedException(`Gestor não pode criar uma pesquisa de um serviço do campus ${servico.campus.nome} pois não é o seu campus!`)

    const pesquisaDto = this.repo.create({
      ...dto,
      dataInicio: dto.dataInicio ? new Date(dto.dataInicio).toISOString() : new Date().toISOString(),
      dataFinal: new Date(dto.dataFinal).toISOString(),
      publicada: dto.dataInicio
        ? new Date(dto.dataInicio).toISOString() > new Date().toISOString()
          ? false
          : true
        : true,
      tipo: Tipo.SATISFACAO,
      tipoId: dto.servicoId,
      status: dto.dataInicio
        ? new Date(dto.dataInicio).toISOString() > new Date().toISOString()
          ? Status.INATIVA
          : Status.ATIVA
        : Status.ATIVA,
    });

    // verificar se pesquisa com mesmo servico ID e mesma dataInicio/dataFinal existem
    const existing = await this.repo.find({
      where: {
        tipoId: dto.servicoId,
        tipo: Tipo.SATISFACAO,
        dataFinal: new Date(dto.dataFinal).toISOString(),
        dataInicio: new Date(dto.dataInicio).toISOString(),
      },
      withDeleted: false,
    });

    // retirar as pesquisas fechadas
    const existingFiltered = existing.filter((p) => p.status !== Status.FECHADA)

    if (existingFiltered.length > 0)
      throw new ConflictException(
        'Pesquisa para este serviço com essas datas existe já existe como ATIVA ou INATIVA.',
      );

    // criar pesquisa
    const pesquisa = await this.repo.save(pesquisaDto);

    if (!pesquisa) throw new Error('Pesquisa não foi criada!');

    // adicionar o id de pesquisa para criar as questões
    const questoes = dto.questoes.map((q) => {
      const questao: any = {
        ...q,
        pesquisaId: pesquisa.id.toString(),
      };

      // remove campos que são null ou undefined
      Object.keys(questao).forEach((key) => {
        if (questao[key] === null || questao[key] === undefined) {
          delete questao[key];
        }
      });

      return questao;
    });

    // criar as questões
    const result = await this.questoesService.createMany(questoes);

    if (!result || result.insertedCount === 0) {
      await this.repo.deleteOne(pesquisa.id);

      throw new Error('Questões não criadas! Pesquisa deletada!');
    }

    return (
      HttpCode.apply(201),
      { message: 'Pesquisa criada com sucesso!', id: pesquisa.id }
    );
  }

  // função para criar Avaliação Docente manualmente
  async createAvaliacao(dto: CreateAvaliacaoDto, campusId: number) {
    // verifica se a turma existe
    const turma = await this.turmaService.findOne(dto.turmaId);

    if (!turma) throw new NotFoundException('Turma não encontrada!');

    // verificar se o campusId do gestor é o mesmo da turma

    // caso o campusId venha 0 é porque a função foi chamada pela função abaixo, createAvaliacaoPeriodo()
    // e a função já tem uma verificação, então pode passar
    if (campusId !== 0 && turma.campus.id !== campusId) throw new UnauthorizedException(`Gestor não pode criar avaliação docente dessa turma pois não é do seu campus!`)

    // cria data final como {fim do periodo + 180 dias}
    const dataFinal = new Date(turma?.periodo?.endDate);

    dataFinal.setDate(dataFinal.getDate() + 180);

    // verificar se pesquisa com essas informações já existe
    const existing = await this.repo.findOne({
      where: { tipoId: dto.turmaId, tipo: Tipo.AVALIACAO },
    });

    if (existing) throw new ConflictException("Já existe uma pesquisa para essa turma!")

    const pesquisa = this.repo.create({
      ...dto,
      dataInicio: dto.dataInicio ? new Date(dto.dataInicio) : new Date(),
      dataFinal: dataFinal,
      publicada: dto.dataInicio
        ? new Date(dto.dataInicio) > new Date()
          ? false
          : true
        : true,
      tipo: Tipo.AVALIACAO,
      tipoId: dto.turmaId,
      status: dto.dataInicio
        ? new Date(dto.dataInicio) > new Date()
          ? Status.INATIVA
          : Status.ATIVA
        : Status.ATIVA,
    });
    return await this.repo.save(pesquisa);
  }

  // função para criar Avaliação Docente a partir do periodo e do curso
  async createAvaliacaoPeriodo(dto: CreateAvaliacaoPeriodoDto, campusId: number) {
    const turmas = await this.turmaService.findByCampus(campusId);

    if (!turmas)
      throw new NotFoundException('Não existem turmas para criar avaliações!');

    // filtra pelo curso e pelo periodo
    const turmasFilted = turmas.filter(
      (t) =>
        t.periodo.id == dto.periodoId && t.disciplina.curso.id == dto.cursoId,
    );

    if (turmasFilted.length === 0)
      throw new NotFoundException('Não há turmas nesse curso e/ou período no seu campus!');

    if (dto.dataInicio) {
      const dateCheck =
        new Date(dto.dataInicio).getUTCDate() >= new Date().getUTCDate();

      if (!dateCheck)
        throw new BadRequestException(
          'Data início deve ser maior ou igual a hoje!',
        );
    }

    // criar avaliação para cada turma
    // contabilizar as pesquisas criadas para retornar
    let count = 0;
    let countExisting = 0;

    for (const turma of turmasFilted) {
      const pesquisaDto: CreateAvaliacaoDto = {
        titulo: `${turma.disciplina.nome} - Turma ${turma.id}`,
        descricao: `Avaliação da disciplina ${turma.disciplina.nome} ministrada por ${turma.docente.nome} em ${turma.periodo.ano}.${turma.periodo.semestre}.`,
        turmaId: turma.id,
        dataInicio: dto.dataInicio ? dto.dataInicio : new Date().toDateString(),
      };

      // verificar se pesquisa com essas informações já existe
      const existing = await this.repo.findOne({
        where: { tipoId: pesquisaDto.turmaId, tipo: Tipo.AVALIACAO },
      });

      if (existing) {
        countExisting++;
      } else {
        const pesquisa = await this.createAvaliacao(pesquisaDto, 0);

        if (!pesquisa) throw new Error('Não foi possível criar a pesquisa!');

        count++;

        // INTERAR SOBRE AS QUESTÕES
        let questoes: CreateQuestaoDto[] = [];
        for (const [key, value] of Object.entries(CRITERIOS)) {
          const questao: CreateQuestaoDto = {
            pesquisaId: pesquisa.id.toString(),
            pergunta: value.descricao,
            tipo: TipoQuestao.ESCALA,
            escalaMax: 6,
          };

          questoes.push(questao);
        }

        const comentario: CreateQuestaoDto = {
          pesquisaId: pesquisa.id.toString(),
          pergunta:
            'Deixe um comentário de feedback para o docente avaliado. (opcional)',
          tipo: TipoQuestao.ABERTA,
        };

        questoes.push(comentario);

        // aqui chama o createMany de QuestoesService
        const result = await this.questoesService.createMany(questoes);

        if (!result || result.insertedCount === 0) {
          await this.repo.deleteOne(pesquisa.id);

          throw new Error('As questões não foram criadas! Pesquisa deletada!');
        }
        count++;
      }
    }

    if (count == 0) {
      return (
        HttpCode.apply(200),
        {
          message: `Nenhuma avaliação nova foi criada pois as ${countExisting} turmas desse curso e período já têm pesquisas.`,
        }
      );
    }

    if (countExisting === 0)
      (HttpCode.apply(201),
        {
          message: `${count / 2} ${count / 2 > 1 ? 'avaliações' : 'avaliação'} criadas com sucesso!`,
        });

    return (
      HttpCode.apply(201),
      {
        message: `${count / 2} ${count / 2 > 1 ? 'avaliações' : 'avaliação'} criadas com sucesso! ${countExisting} já existia${countExisting > 1 ? 'm' : ''} e não fo${countExisting > 1 ? 'ram' : 'i'} recriada${countExisting > 1 ? 's' : ''}.`,
      }
    );
  }

  // auxiliar : mostra as perguntas das avaliações docente com os critérios
  async getPreviewAvaliacaoDocente() {
    let questoes: Array<Object> = [];

    for (const [key, value] of Object.entries(CRITERIOS)) {
      const questao = {
        pergunta: value.descricao,
        tipo: TipoQuestao.ESCALA,
        escalaMax: 6,
      };
      questoes.push(questao);
    }

    const comentario = {
      pergunta:
        'Deixe um comentário de feedback para o docente avaliado. (opcional)',
      tipo: TipoQuestao.ABERTA,
    };

    questoes.push(comentario);

    return questoes;
  }

  // DASHBOARD - funções auxiliares
  async findByAluno(campusId: number, turmaIds: number[]) {
    // avaliações docente
    // não buscar avaliações docente caso não haja turmasId
    let avaliacoesDocente: any[] = [];

    if (turmaIds.length > 0) {
      avaliacoesDocente = await this.repo.find({
        where: {
          tipoId: { $in: turmaIds },
          tipo: Tipo.AVALIACAO,
        },
      });
    }

    // pesquisas de satisfação
    const pesquisasSatisfacao = await this.repo.find({
      where: {
        tipo: Tipo.SATISFACAO,
        publicada: true,
        // aqui entrará a lógica de "não respondidas" futuramente
      },
    });

    // filtrar pesquisas de satisfação para mostrar só as do campus do aluno
    // passo 1 - buscar os serviços naquele campus
    const servicosCampus = await this.servicoService.servicosByCampus(campusId);

    // passo 2 - filtrar as pesquisas de satisfação para mostrar só as dos serviços daquele campus
    const servicoIds = servicosCampus.map((s) => s.id);

    const filteredSatisfacao = pesquisasSatisfacao.filter((p) =>
      servicoIds.includes(p.tipoId),
    );

    return {
      avaliacoesDocente,
      filteredSatisfacao,
    };
  }

  // No PesquisasService
  async findByDocente(docenteId: number) {
    const turmasDocente = await this.turmaService.findAllProfessor(docenteId);

    const turmaIds = turmasDocente.turmas
      .map((t) => t.id)
      .filter((id): id is number => id !== undefined && id !== null);

    if (turmaIds.length === 0) {
      return { avaliacoes: [] };
    }

    return await this.repo.find({
      where: {
        tipoId: { $in: turmaIds },
        tipo: Tipo.AVALIACAO,
      },
    });
  }

  async findByGestor(campusId: number) {
    // avaliações docente

    // buscar as turmas do campus do gestor
    const turmasCampus = await this.turmaService.findByCampus(campusId);

    const turmaIds = turmasCampus.map((t) => t.id);

    // buscar todas as avaliações docente das turmas do campus do gestor
    let avaliacoesDocente: any[] = [];

    if (turmaIds.length > 0) {
      avaliacoesDocente = await this.repo.find({
        where: {
          tipoId: { $in: turmaIds },
          tipo: Tipo.AVALIACAO,
        },
      });
    }

    // pesquisas de satisfação
    const pesquisasSatisfacao = await this.repo.find({
      where: {
        tipo: Tipo.SATISFACAO
      },
    });

    // filtrar pesquisas de satisfação para mostrar só as do campus do gestor
    // passo 1 - buscar os serviços naquele campus
    const servicosCampus = await this.servicoService.servicosByCampus(campusId);

    // passo 2 - filtrar as pesquisas de satisfação para mostrar só as dos serviços daquele campus
    const servicoIds = servicosCampus.map((s) => s.id);

    const filteredSatisfacao = pesquisasSatisfacao.filter((p) =>
      servicoIds.includes(p.tipoId),
    );

    return {
      avaliacoesDocente,
      filteredSatisfacao,
    };
  }

  async update(id: string, dto: Partial<CreatePesquisaDto>, usuario: any) {
    const pesquisaAtual = await this.findOne(id);

    // verificar se o gestor tentando deletar a pesquisa é do campus dela
    // caso seja pesquisa de satisfação
    if (pesquisaAtual.tipo = Tipo.SATISFACAO) {
      const servico = await this.servicoService.findOne(pesquisaAtual.tipoId);

      if (servico.campus.id !== usuario.campusId) throw new UnauthorizedException("Gestor não pode alterar pesquisa de outro campus!")
    } 
    else if (pesquisaAtual.tipo = Tipo.AVALIACAO) {
      const turma = await this.turmaService.findOne(pesquisaAtual.tipoId);

      if (turma.campus.id !== usuario.campusId) throw new UnauthorizedException("Gestor não pode alterar pesquisa de outro campus!")
    }

    // Proteção contra body vazio ou nulo
    const camposEditados = Object.keys(dto || {});
    if (camposEditados.length === 0) {
      return { message: 'Nenhuma alteração detectada' };
    }

    if (pesquisaAtual.publicada) {
      const apenasDataFinal =
        camposEditados.length === 1 && camposEditados[0] === 'dataFinal';

      if (!apenasDataFinal) {
        throw new ForbiddenException(
          'Apenas o prazo final de pesquisas publicadas pode ser editado.',
        );
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
          dadosNovos: { dataFinal: dto.dataFinal },
        });
      }
    }

    const updateData: any = { ...dto };
    if (dto.dataInicio) updateData.dataInicio = new Date(dto.dataInicio);
    if (dto.dataFinal) updateData.dataFinal = new Date(dto.dataFinal);

    await this.repo.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return { message: 'Atualização concluída com sucesso' };
  }

  async publicar(id: string, usuario: any) {
    await this.findOne(id);
    await this.repo.updateOne(
      { _id: new ObjectId(id) },
      { $set: { publicada: true } },
    );

    await this.auditoriaService.registrar({
      usuarioId: String(usuario?.userId || usuario?.id || 'system'),
      usuarioNome: usuario?.username || usuario?.nome || 'Admin',
      entidade: 'Pesquisa',
      entidadeId: id,
      acao: 'PUBLICAR_PESQUISA',
      dadosNovos: { publicada: true },
    });

    return { message: 'Pesquisa publicada' };
  }

  async remove(id: string, usuario: any) {
    const pesquisa = await this.findOne(id);
    const objId = new ObjectId(id);
    const filter = { $or: [{ pesquisaId: id }, { pesquisaId: objId as any }] };

    // verificar se o gestor tentando deletar a pesquisa é do campus dela
    // caso seja pesquisa de satisfação
    if (pesquisa.tipo = Tipo.SATISFACAO) {
      const servico = await this.servicoService.findOne(pesquisa.tipoId);

      if (servico.campus.id !== usuario.campusId) throw new UnauthorizedException("Gestor não pode deletar pesquisa de outro campus!")
    } 
    else if (pesquisa.tipo = Tipo.AVALIACAO) {
      const turma = await this.turmaService.findOne(pesquisa.tipoId);

      if (turma.campus.id !== usuario.campusId) throw new UnauthorizedException("Gestor não pode deletar pesquisa de outro campus!")
    }

    await this.respostaRepo.deleteMany(filter as any);
    await this.questaoRepo.deleteMany(filter as any);
    await this.repo.deleteOne({ _id: objId });

    await this.auditoriaService.registrar({
      usuarioId: String(usuario?.userId || usuario?.id || 'system'),
      usuarioNome: usuario?.username || usuario?.nome || 'Admin',
      entidade: 'Pesquisa',
      entidadeId: id,
      acao: 'REMOVER_PESQUISA',
      dadosAnteriores: { titulo: pesquisa.titulo },
    });

    return { message: 'Pesquisa removida' };
  }
}
