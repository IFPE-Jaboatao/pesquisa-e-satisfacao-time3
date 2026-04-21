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
    });

    if (exists) {
      throw new ConflictException('Matr[icula já existe!');
    }

    // busca paralela
    const [turma, aluno] = await Promise.all([
      this.turmaRepo.findOne({ where: { id: turmaId } }),
      this.usersRepo.findOne({ where: { id: alunoId } }),
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
        username: outputMatricula?.aluno.username,
      },
      turma: {
        id: outputMatricula?.turma.id,
        nome: outputMatricula?.turma.nome,
        disciplina: outputMatricula?.turma.disciplina,
        docente: {
          id: outputMatricula?.turma.docente?.id,
          username: outputMatricula?.turma.docente?.username,
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
        turmaNome: matriculas[0]?.turma.nome,
        turmaPeriodo: matriculas[0]?.turma.periodo,
        turmaDisciplina: matriculas[0]?.turma.disciplina,
        turmaDocente: {
          id: matriculas[0]?.turma.docente.id,
          username: matriculas[0]?.turma.docente.username,
        },
        matriculas: matriculas?.map((matricula) => ({
          id: matricula?.id,
          aluno: {
            id: matricula?.aluno.id,
            username: matricula?.aluno.username,
          },
        })),
      };
    }

    // output geral de matriculas sem turma especificada
    return matriculas?.map((matricula) => ({
      id: matricula?.id,
      turma: {
        id: matricula?.turma.id,
        nome: matricula?.turma.nome,
        disciplina: matricula?.turma.disciplina,
        periodo: matricula?.turma.periodo,
        docente: {
          id: matricula?.turma.docente.id,
          username: matricula?.turma.docente.username,
        },
      },
      aluno: { id: matricula?.aluno?.id, username: matricula?.aluno?.username },
    }));
  }

  // listar todas as matrículas de um aluno
  async findAllStudent(alunoId?: number) {
    const aluno = await this.usersRepo.findOne({ where: { id: alunoId } });

    if (!aluno) throw new NotFoundException('Aluno não encontrado!');

    if (aluno.role !== Role.ALUNO)
      throw new BadRequestException(
        `Usuários com role ${aluno.role} não pode ter matrículas!`,
      );

    const matriculas = await this.matriculaRepo.find({
      where: {aluno: aluno},
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
      alunoUsername: matriculas[0]?.aluno.username,
      matriculas: matriculas?.map((matricula) => ({
        id: matricula?.id,
        turma: {
          id: matricula?.turma.id,
          nome: matricula?.turma.nome,
          disciplina: {
            id: matricula?.turma.disciplina.id,
            nome: matricula?.turma.disciplina.nome,
          },
          periodo: matricula?.turma.periodo,
          docente: {
            id: matricula?.turma.docente.id,
            username: matricula?.turma.docente.username,
          },
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
    });

    if (!matricula) throw new NotFoundException('Matrícula não encontrada!');

    return {
      id: matricula?.id,
      turma: {
        id: matricula?.turma.id,
        nome: matricula?.turma.nome,
        disciplina: matricula?.turma.disciplina,
        periodo: matricula?.turma.periodo,
        docente: {
          id: matricula?.turma.docente.id,
          username: matricula?.turma.docente.username,
        },
      },
      aluno: { id: matricula?.aluno?.id, username: matricula?.aluno?.username },
    };
  }

  // atualizar matrícula
  async update(id: number, updateMatriculaDTO: UpdateMatriculaDto) {
    const matricula = await this.matriculaRepo.findOne({
      where: { id },
      relations: {
        aluno: true,
        turma: true,
      },
    });

    if (!matricula) {
      throw new NotFoundException('Turma não encontrada!');
    }

    // validação de duplicidade (excluindo ela mesma)
    const exists = await this.matriculaRepo.findOne({
      where: {
        aluno: { id: updateMatriculaDTO.alunoId ?? matricula.aluno.id },
        turma: { id: updateMatriculaDTO.turmaId ?? matricula.turma.id },
      },
    });

    if (exists && exists.id !== id) {
      throw new ConflictException('Matrícula já existe!');
    }

    // valida turma
    const turma = await this.turmaRepo.findOne({
      where: { id: updateMatriculaDTO.turmaId ?? matricula.turma.id },
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada!');
    }

    // valida aluno
    let aluno = matricula.aluno;

    if (updateMatriculaDTO.alunoId) {
      const found = await this.usersRepo.findOne({
        where: { id: updateMatriculaDTO.alunoId },
      });

      if (!found) {
        throw new NotFoundException('Aluno não encontrado!');
      }

      if (found.role !== Role.ALUNO) {
        throw new BadRequestException(
          `Usuário de role ${found.role} não pode ser aluno!`,
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
    });

    return {
      id: updated?.id,
      turma: {
        id: updated?.turma.id,
        nome: updated?.turma.nome,
        periodo: updated?.turma.periodo,
        disciplina: updated?.turma.disciplina,
        docente: {
          id: updated?.turma.docente.id,
          username: updated?.turma.docente.username,
        },
      },
      aluno: {
        id: updated?.aluno?.id,
        username: updated?.aluno?.username,
      },
    };
  }

  // deletar matrícula
  async remove(id: number) {
    const result = await this.matriculaRepo.delete(id);

    if (result.affected === 0)
      throw new NotFoundException('Matrícula não encontrada!');

    return { success: true, message: 'Matrícula deletada com sucesso!' };
  }
}
