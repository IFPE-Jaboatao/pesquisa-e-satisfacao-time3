import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Turma } from '../turma/entities/turma.entity';
import { Matricula } from './entities/matricula.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Role } from 'src/users/user-role.enum';
import { Disciplina } from '../disciplina/entities/disciplina.entity';
import { isNumber } from 'class-validator';

@Injectable()
export class MatriculaService {
  constructor(
    @InjectRepository(Matricula, 'mysql')
    private matriculaRepo: Repository<Matricula>,

    @InjectRepository(Turma, 'mysql')
    private turmaRepo: Repository<Turma>,

    @InjectRepository(User, 'mysql')
    private usersRepo: Repository<User>,
  ) {}

  async create(createMatriculaDto: CreateMatriculaDto) {
    const { alunoId, turmaId } = createMatriculaDto;

    // validação de duplicidade
    const exists = await this.matriculaRepo.findOne({
      where: {
        turma: { id: turmaId },
        aluno: { id: alunoId },
      },
      withDeleted: false
    });

    if (exists) {
      throw new ConflictException('Matr[icula já existe!');
    }

    // busca paralela
    const [turma, aluno] = await Promise.all([
      this.turmaRepo.findOne({ where: { id: turmaId }, withDeleted: false, relations: { disciplina: { curso: { campus: true } } } } ),
      this.usersRepo.findOne({ where: { id: alunoId }, withDeleted: false, relations: { campus: true } }),
    ]);

    // validações
    if (!turma) {
      throw new NotFoundException('Turma não encontrada!');
    }

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado!');
    }

    if (aluno.role !== Role.ALUNO) {
      throw new BadRequestException(
        `Usuário de role ${aluno.role} não pode ser matriculado como aluno!`,
      );
    }

    // valida se aluno e turma pertencem ao mesmo campus
    if (aluno.campus.id !== turma.disciplina.curso.campus.id) {
      throw new BadRequestException(
        `Aluno e disciplina devem pertencer ao mesmo campus! Aluno pertence ao campus ${aluno.campus.nome} e turma está no campus ${turma.disciplina.curso.campus.nome}`,
      );
    }

    // criando entidade
    const matricula = this.matriculaRepo.create({
      aluno,
      turma,
    });

    // salvando entidade
    const savedMatricula = await this.matriculaRepo.save(matricula);

    // output com relações explicitas
    const outputMatricula = await this.matriculaRepo.findOne({
      where: { id: savedMatricula.id },
      relations: {
        turma: {
          docente: true,
          periodo: true,
          disciplina: true,
        },
        aluno: true,
      },
    });

    return {
      id: outputMatricula?.id,
      aluno: {
        id: outputMatricula?.aluno.id,
        matricula: outputMatricula?.aluno.matricula,
        nome: outputMatricula?.aluno.nome,
        email: outputMatricula?.aluno.email,
      },
      turma: {
        id: outputMatricula?.turma.id,
        disciplina: outputMatricula?.turma.disciplina,
        docente: {
          id: outputMatricula?.turma.docente?.id,
          matricula: outputMatricula?.turma.docente?.matricula,
          nome: outputMatricula?.turma.docente?.nome,
          email: outputMatricula?.turma.docente?.email,
        },
        periodo: outputMatricula?.turma.periodo,
      },
    };
  }

  async findAll(turmaId?: number) {
    const matriculas = await this.matriculaRepo.find({
      where: turmaId ? { turma: { id: turmaId } } : {},
      relations: {
        aluno: true,
        turma: {
          docente: true,
          periodo: true,
          disciplina: true,
        },
      },
    });

    // retorno especifico para turma especifica
    // evita repetição de informações desnecessariamente
    if (turmaId) {
      return {
        turmaId: matriculas[0]?.turma.id,
        turmaPeriodo: matriculas[0]?.turma.periodo,
        turmaDisciplina: matriculas[0]?.turma.disciplina,
        turmaDocente: {
          id: matriculas[0]?.turma.docente.id,
          matricula: matriculas[0]?.turma.docente.matricula,
          nome: matriculas[0]?.turma.docente.nome,
          email: matriculas[0]?.turma.docente.email,
        },
        matriculas: matriculas?.map((matricula) => ({
          id: matricula?.id,
          aluno: {
            id: matricula?.aluno.id,
            matricula: matricula?.aluno.matricula,
            nome: matricula?.aluno.nome,
            email: matricula?.aluno.email,
          },
        })),
      };
    }

    // output geral de matriculas sem turma especificada
    return matriculas?.map((matricula) => ({
      id: matricula?.id,
      turma: {
        id: matricula?.turma.id,
        disciplina: matricula?.turma.disciplina,
        periodo: matricula?.turma.periodo,
        docente: {
          id: matricula?.turma.docente.id,
          matricula: matricula?.turma.docente.matricula,
          nome: matricula?.turma.docente.nome,
          email: matricula?.turma.docente.email,
        },
      },
      aluno: { id: matricula?.aluno?.id, matricula: matricula?.aluno?.matricula, nome: matricula?.aluno?.nome, email: matricula?.aluno?.email },
    }));
  }

  // função auxiliar para retornar matriculas para dashboard do admin
    async findAllAdmin() {
    const matriculas = await this.matriculaRepo.find({
      relations: {
        aluno: true,
        turma: {
          docente: true,
          periodo: true,
          disciplina: { curso: { campus: true } },
        },
      },
    });


    // output geral de matriculas sem turma especificada
    return matriculas?.map((matricula) => ({
      id: matricula?.id,
      aluno: { id: matricula?.aluno?.id, nome: matricula?.aluno?.nome, email: matricula?.aluno?.email }, 
      turma: {id: matricula?.turma?.id, disciplina: matricula?.turma?.disciplina?.nome, periodo: `${matricula?.turma?.periodo.ano}.${matricula?.turma?.periodo.semestre}`},
      campus: { id: matricula?.turma?.disciplina?.curso?.campus?.id,
        nome: matricula?.turma?.disciplina?.curso?.campus?.nome,
      }
    }));
  }

  // listar todas as matrículas de um aluno
  async findAllStudent(alunoId?: number) {
    const aluno = await this.usersRepo.findOne({ where: { id: alunoId }, withDeleted: false });

    if (!aluno) throw new NotFoundException('Aluno não encontrado!');

    if (aluno.role !== Role.ALUNO)
      throw new BadRequestException(
        `Usuários com role ${aluno.role} não pode ter matrículas!`,
      );

    const matriculas = await this.matriculaRepo.find({
      where: { aluno: { id: aluno?.id }},
      relations: {
        turma: {
          docente: true,
          periodo: true,
          disciplina: true,
        },
        aluno: true
      },
    });

    // informações do aluno não se repetem
    return {
      alunoId: matriculas[0]?.aluno.id,
      alunoMatricula: matriculas[0]?.aluno.matricula,
      alunoNome: matriculas[0]?.aluno.nome,
      alunoEmail: matriculas[0]?.aluno.email,
      matriculas: matriculas?.map((m?) => ({
        id: m?.id,
        turma: {
          id: m?.turma?.id,
          disciplina: {
            id: m?.turma?.disciplina?.id,
            nome: m?.turma?.disciplina?.nome,
          },
          periodo: {
            id: m?.turma?.periodo?.id,
            ano: m?.turma?.periodo?.ano,
            semestre: m?.turma?.periodo?.semestre
          },
          docente: {
            id: m?.turma?.docente?.id,
            matricula: m?.turma.docente?.matricula,
            nome: m?.turma?.docente?.nome,
            email: m?.turma?.docente?.email,
          },
          turno: m?.turma.turno
        },
      })),
    };
  }

  // buscar uma matrícula especifica
  async findOne(id: number) {
    if (!isNumber(id)) throw new BadRequestException('ID deve ser um número!');

    const matricula = await this.matriculaRepo.findOne({
      where: { id },
      relations: {
        aluno: true,
        turma: {
          docente: true,
          periodo: true,
          disciplina: true,
        },
      },
      withDeleted: false
    });

    if (!matricula) throw new NotFoundException('Matrícula não encontrada!');

    return {
      id: matricula?.id,
      turma: {
        id: matricula?.turma.id,
        disciplina: matricula?.turma.disciplina,
        periodo: matricula?.turma.periodo,
        docente: {
          id: matricula?.turma.docente.id,
          matricula: matricula?.turma.docente.matricula,
          nome: matricula?.turma.docente.nome,
          email: matricula?.turma.docente.email,
        },
      },
      aluno: { id: matricula?.aluno?.id, matricula: matricula?.aluno?.matricula, nome: matricula?.aluno?.nome, email: matricula?.aluno?.email },
    };
  }

  // função auxiliar para soft delete cascade vindo de turma
  async findByTurma(turmaId: number) {
    // retorna os matriculas da turma deletada
    const todasTurmas = await this.matriculaRepo.find({
      where: { turma: { id:turmaId } }, withDeleted: true })

      // retorna apenas matriculas que não foram deletadas
    return todasTurmas.filter((c) => c.deletedAt === null)
  }

  // função auxiliar para soft delete cascade vindo de aluno
  async findByAluno(alunoId: number) {
    // retorna os matriculas do aluno deletado
    const todasMatriculas = await this.matriculaRepo.find({
      where: { aluno: { id:alunoId } }, withDeleted: true, relations: {turma: true} })

      // retorna apenas matriculas que não foram deletadas
    return todasMatriculas.filter((c) => c.deletedAt === null)
  }

  // atualizar matrícula
  async update(id: number, updateMatriculaDTO: UpdateMatriculaDto) {
    const matricula = await this.matriculaRepo.findOne({
      where: { id },
      relations: {
        aluno: true,
        turma: true,
      },
      withDeleted: false
    });

    if (!matricula) {
      throw new NotFoundException('Matrícula não encontrada!');
    }

    // validação de duplicidade (excluindo ela mesma)
    const exists = await this.matriculaRepo.findOne({
      where: {
        aluno: { id: updateMatriculaDTO.alunoId ?? matricula.aluno.id },
        turma: { id: updateMatriculaDTO.turmaId ?? matricula.turma.id },
      },
      withDeleted: false
    });

    if (exists && exists.id !== id) {
      throw new ConflictException('Matrícula já existe!');
    }

    // valida turma
    const turma = await this.turmaRepo.findOne({
      where: { id: updateMatriculaDTO.turmaId ?? matricula.turma.id },
      withDeleted: false,
      relations: { disciplina: { curso: { campus: true } } }
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada!');
    }

    // valida aluno
    let aluno = matricula.aluno;

    if (updateMatriculaDTO.alunoId) {
      const found = await this.usersRepo.findOne({
        where: { id: updateMatriculaDTO.alunoId },
        withDeleted: false,
        relations: { campus: true }
      });

      if (!found) {
        throw new NotFoundException('Aluno não encontrado!');
      }

      if (found.role !== Role.ALUNO) {
        throw new BadRequestException(
          `Usuário de role ${found.role} não pode ser aluno!`,
        );
      }

    // valida se aluno e turma pertencem ao mesmo campus
    if (found.campus.id !== turma.disciplina.curso.campus.id) {
      throw new BadRequestException(
        `Aluno e disciplina devem pertencer ao mesmo campus! Aluno pertence ao campus ${found.campus.nome} e turma está no campus ${turma.disciplina.curso.campus.nome}`,
      );
    }

      aluno = found;
    }

    // aplica update manual
    matricula.turma = turma;
    matricula.aluno = aluno;

    await this.matriculaRepo.save(matricula);

    const updated = await this.matriculaRepo.findOne({
      where: { id },
      relations: {
        aluno: true,
        turma: {
          docente: true,
          disciplina: true,
          periodo: true,
        },
      },
      withDeleted: false
    });

    return {
      id: updated?.id,
      turma: {
        id: updated?.turma.id,
        periodo: updated?.turma.periodo,
        disciplina: updated?.turma.disciplina,
        docente: {
          id: updated?.turma.docente.id,
          matricula: updated?.turma.docente.matricula,
          nome: updated?.turma.docente.nome,
          email: updated?.turma.docente.email,
        },
      },
      aluno: {
        id: updated?.aluno?.id,
        matricula: updated?.aluno?.matricula,
        nome: updated?.aluno?.nome,
        email: updated?.aluno?.email,
      },
    };
  }

  // deletar matrícula
  async remove(id: number) {
    const matricula = await this.matriculaRepo.findOne({where: {id}, withDeleted: false});

    if (!matricula) throw new NotFoundException("Matrícula não encontrada!")

    const result = await this.matriculaRepo.softDelete(id);

    if (result.affected === 0)
      throw new NotFoundException('Matrícula não encontrada!');

    return { success: true, message: 'Matrícula deletada com sucesso!' };
  }
}
