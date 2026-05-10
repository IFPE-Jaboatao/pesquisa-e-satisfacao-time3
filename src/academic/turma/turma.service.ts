import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Turma } from './entities/turma.entity';
import { Repository } from 'typeorm';
import { Disciplina } from '../disciplina/entities/disciplina.entity';
import { Periodo } from '../periodo/entities/periodo.entity';
import { User } from 'src/users/user.entity';
import { Role } from 'src/users/user-role.enum';
import { Matricula } from '../matricula/entities/matricula.entity';
import { isNumber } from 'class-validator';
import e from 'express';
import { TurmaDeletedEvent } from 'src/shared/events/turma-deleted.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateAvaliacaoPeriodoDto } from 'src/pesquisas/dto/create-avaliacao-periodo.dto';
import { PesquisasService } from 'src/pesquisas/pesquisas.service';

@Injectable()
export class TurmaService {
  constructor(
    @InjectRepository(Turma, 'mysql')
    private turmaRepo: Repository<Turma>,

    @InjectRepository(Disciplina, 'mysql')
    private disciplinaRepo: Repository<Disciplina>,

    @InjectRepository(Periodo, 'mysql')
    private periodoRepo: Repository<Periodo>,

    @InjectRepository(User, 'mysql')
    private usersRepo: Repository<User>,

    private readonly eventEmitter: EventEmitter2
  ) {}

  async create(createTurmaDto: CreateTurmaDto) {
    const { turno, disciplinaId, periodoId, docenteId } = createTurmaDto;

    // validação de duplicidade
    const exists = await this.turmaRepo.findOne({
      where: {
        turno,
        disciplina: { id: disciplinaId },
        periodo: { id: periodoId },
        docente: { id: docenteId },
      },
      withDeleted: false
    });

    if (exists) {
      throw new ConflictException('Turma já existe!');
    }

    // busca paralela
    const [disciplina, periodo, docente] = await Promise.all([
      this.disciplinaRepo.findOne({ where: { id: disciplinaId }, withDeleted: false, relations: { curso: { campus: true } } } ),
      this.periodoRepo.findOne({ where: { id: periodoId }, withDeleted: false }),
      this.usersRepo.findOne({ where: { id: docenteId }, withDeleted: false, relations: { campus: true } }),
    ]);

    // validações
    if (!disciplina) {
      throw new NotFoundException('Disciplina não encontrada!');
    }

    if (!periodo) {
      throw new NotFoundException('Período não encontrado!');
    }

    if (!docente) {
      throw new NotFoundException('Docente não encontrado!');
    }

    if (docente.role !== Role.DOCENTE) {
      throw new BadRequestException(
        `Usuário de role ${docente.role} não pode ser docente!`,
      );
    }

    // validação de campus do docente e o da disciplina (devem ser iguais)
    if (docente.campus.id !== disciplina.curso.campus.id) {
      throw new BadRequestException(
        `Docente e disciplina devem pertencer ao mesmo campus! Docente pertence ao campus ${docente.campus.nome} e disciplina pertence ao campus ${disciplina.curso.campus.nome}`,
      );
    }

    // criando entidade
    const turma = this.turmaRepo.create({
      turno,
      disciplina,
      periodo,
      docente,
    });

    const savedTurma = await this.turmaRepo.save(turma);

    return {
      id: savedTurma.id,
      turno: savedTurma.turno,
      disciplina: savedTurma.disciplina,
      periodo: savedTurma.periodo,
      docente: {
        id: savedTurma.docente.id,
        matricula: savedTurma.docente.matricula,
        nome: savedTurma.docente.nome,
        email: savedTurma.docente.email,
      },
      createdAt: savedTurma.createdAt,
      updatedAt: savedTurma.updatedAt
    };
  }

  async findAll(disciplinaId?: number) {
    const turmas = await this.turmaRepo.find({
      where: disciplinaId ? { disciplina: { id: disciplinaId } } : {},
      relations: { disciplina: { curso: true}, periodo: true, docente: true },
      withDeleted: false
    });

    return turmas.map((turma) => ({
      id: turma?.id,
      turno: turma?.turno,
      disciplina: turma?.disciplina,
      periodo: turma?.periodo,
      docente: { id: turma.docente?.id, matricula: turma.docente?.matricula, nome: turma.docente?.nome, email: turma.docente?.email },
    }));
  }

  async findAllProfessor(docenteId: number) {
    const docente = await this.usersRepo.findOne({ where: { id: docenteId }, withDeleted: false });

    if (!docente) throw new NotFoundException('Docente não encontrado!');

    if (docente.role !== Role.DOCENTE)
      throw new BadRequestException(
        `Usuários com role ${docente.role} não podem ministrar turmas!`,
      );

    const turmas = await this.turmaRepo.find({
      where: { docente: {id: docente.id} },
      relations: {
        docente: true,
        periodo: true,
        disciplina: true,
      },
      withDeleted: false
    });

    // informações do docente não se repetem
    return {
      docenteId: turmas[0]?.docente.id,
      docenteMatricula: turmas[0]?.docente.matricula,
      docenteNome: turmas[0]?.docente.nome,
      docenteEmail: turmas[0]?.docente.email,
      turmas: turmas?.map((turma) => ({
        id: turma?.id,
        turno: turma?.turno,
        disciplina: {
          id: turma?.disciplina.id,
          nome: turma?.disciplina.nome,
        },
        periodo: turma?.periodo,
      })),
    };
  }

  async findOne(id: number) {
    if (!isNumber(id)) throw new BadRequestException('ID deve ser um número!');

    const turma = await this.turmaRepo.findOne({
      where: { id },
      relations: { disciplina: true, periodo: true, docente: true },
      withDeleted: false
    });

    if (!turma) throw new NotFoundException('Turma não encontrada!');

    return {
      id: turma.id,
      turno: turma.turno,
      disciplina: turma.disciplina,
      periodo: turma.periodo,
      docente: { id: turma.docente.id, matricula: turma.docente.matricula, nome: turma.docente.nome, email: turma.docente.email },
      createdAt: turma.createdAt,
      updatedAt: turma.updatedAt
    };
  }

  // função auxiliar para soft delete cascade vindo de disciplina
  async findByDisciplina(disciplinaId?: number) {
      const todasTurmas = await this.turmaRepo.find({
      where: { disciplina: { id:disciplinaId } }, withDeleted: true })

      // retorna apenas turmas que não foram deletados
    return todasTurmas.filter((c) => c.deletedAt === null)
  }

  // função auxiliar para soft delete cascade vindo de periodo
  async findByPeriodo(periodoId?: number) {
      const todasTurmas = await this.turmaRepo.find({
      where: { periodo: { id:periodoId } }, withDeleted: true })

      // retorna apenas turmas que não foram deletados
    return todasTurmas.filter((c) => c.deletedAt === null)
  }

  // função auxiliar para soft delete cascade vindo de docente deletado
  async findByDocente(docenteId?: number) {
      const todasTurmas = await this.turmaRepo.find({
      where: { docente: { id:docenteId } }, withDeleted: true })

      // retorna apenas turmas que não foram deletados
    return todasTurmas.filter((c) => c.deletedAt === null)
  }

  // função auxiliar para pre visualizar as avaliações docentes disponíveis
  async findAvaliacoesDisponiveis(dto: CreateAvaliacaoPeriodoDto) {
    const turmas = await this.findAll();

    // filtra pelo curso e pelo periodo
    const turmasFilted = turmas.filter((t) => t.periodo.id == dto.periodoId && t.disciplina.curso.id == dto.cursoId)

    if (turmasFilted.length === 0) throw new NotFoundException("Não há turmas nesse curso e/ou período!");

    // coletar as avaliações
    const avaliacoes: Array<Object> = []

    for (const turma of turmasFilted) {

      const pesquisa: Object = {
        titulo: turma.disciplina.nome,
        turmaId: turma.id,
        docente: turma.docente.nome,
        turno: turma.turno
      };
        avaliacoes.push(pesquisa)
    }
    
    return avaliacoes
  }

  async update(id: number, updateTurmaDto: UpdateTurmaDto) {
    const turma = await this.turmaRepo.findOne({
      where: { id },
      relations: {
        disciplina: true,
        periodo: true,
        docente: true,
      },
      withDeleted: false
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada!');
    }

    // validação de duplicidade (excluindo ela mesma)
    const exists = await this.turmaRepo.findOne({
      where: {
        turno: updateTurmaDto.turno ?? turma.turno,
        disciplina: { id: updateTurmaDto.disciplinaId ?? turma.disciplina.id },
        periodo: { id: updateTurmaDto.periodoId ?? turma.periodo.id },
        docente: { id: updateTurmaDto.docenteId ?? turma.docente.id },
      },
      withDeleted: false
    });

    if (exists && exists.id !== id) {
      throw new ConflictException('Turma já existe!');
    }

    // valida disciplina
    const disciplina = await this.disciplinaRepo.findOne({
      where: { id: updateTurmaDto.disciplinaId ?? turma.disciplina.id },
      withDeleted: false,
      relations: { curso: { campus: true } }
    });

    if (!disciplina) {
      throw new NotFoundException('Disciplina não encontrada!');
    }

    // valida periodo
    const periodo = await this.periodoRepo.findOne({
      where: { id: updateTurmaDto.periodoId ?? turma.periodo.id },
      withDeleted: false
    });

    if (!periodo) {
      throw new NotFoundException('Período não encontrado!');
    }

    // valida docente
    let docente = turma.docente;

    if (updateTurmaDto.docenteId) {
      const found = await this.usersRepo.findOne({
        where: { id: updateTurmaDto.docenteId },
        withDeleted: false,
        relations: { campus: true }
      });

      if (!found) {
        throw new NotFoundException('Docente não encontrado!');
      }

      if (found.role !== Role.DOCENTE) {
        throw new BadRequestException(
          `Usuário de role ${found.role} não pode ser docente!`,
        );
      }

        // validação de campus do docente e o da disciplina (devem ser iguais)
      if (found.campus.id !== disciplina.curso.campus.id) {
        throw new BadRequestException(
          `Docente e disciplina devem pertencer ao mesmo campus! Docente pertence ao campus ${found.campus.nome} e disciplina pertence ao campus ${disciplina.curso.campus.nome}`,
        );
      }

      docente = found;
    }

    // aplica update manual
    turma.turno = updateTurmaDto.turno ?? turma.turno;
    turma.disciplina = disciplina;
    turma.periodo = periodo;
    turma.docente = docente;

    await this.turmaRepo.save(turma);

    const updated = await this.turmaRepo.findOne({
      where: { id },
      relations: {
        disciplina: true,
        periodo: true,
        docente: true,
      },
      withDeleted: false
    });

    return {
      id: updated?.id,
      turno: updated?.turno,
      disciplina: updated?.disciplina,
      periodo: updated?.periodo,
      docente: {
        id: updated?.docente?.id,
        matricula: updated?.docente?.matricula,
        nome: updated?.docente?.nome,
        email: updated?.docente?.email,
      },
      createdAt: updated?.createdAt,
      updatedAt: updated?.updatedAt
    };
  }

  async remove(id: number) {
    const turma = await this.turmaRepo.findOne({where: {id}, withDeleted: false});

    if (!turma) throw new NotFoundException("Turma não encontrada!")

    const result = await this.turmaRepo.softDelete(id);

    if (result.affected === 0)
      throw new NotFoundException('Turma não encontrada!');

    // evento emitado para deletar matriculas e pesquisas da turma
    this.eventEmitter.emit(
      'turma.deleted',
      new TurmaDeletedEvent(turma.id)
    )

    return { success: true, message: 'Turma deletada com sucesso!' };
  }
}
