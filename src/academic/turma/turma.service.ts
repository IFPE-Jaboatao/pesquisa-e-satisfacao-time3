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
  ) {}

  async create(createTurmaDto: CreateTurmaDto) {
    const { nome, disciplinaId, periodoId, docenteId } = createTurmaDto;

    // validação de duplicidade
    const exists = await this.turmaRepo.findOne({
      where: {
        nome,
        disciplina: { id: disciplinaId },
        periodo: { id: periodoId },
        docente: { id: docenteId },
      },
    });

    if (exists) {
      throw new ConflictException('Turma já existe!');
    }

    // busca paralela
    const [disciplina, periodo, docente] = await Promise.all([
      this.disciplinaRepo.findOne({ where: { id: disciplinaId } }),
      this.periodoRepo.findOne({ where: { id: periodoId } }),
      this.usersRepo.findOne({ where: { id: docenteId } }),
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

    // criando entidade
    const turma = this.turmaRepo.create({
      nome,
      disciplina,
      periodo,
      docente,
    });

    const savedTurma = await this.turmaRepo.save(turma);

    return {
      id: savedTurma.id,
      nome: savedTurma.nome,
      disciplina: savedTurma.disciplina,
      periodo: savedTurma.periodo,
      docente: {
        id: savedTurma.docente.id,
        username: savedTurma.docente.username,
      },
    };
  }

  async findAll(disciplinaId?: number) {
    const turmas = await this.turmaRepo.find({
      where: disciplinaId ? { disciplina: { id: disciplinaId } } : {},
      relations: { disciplina: true, periodo: true, docente: true },
    });

    return turmas.map((turma) => ({
      id: turma?.id,
      nome: turma?.nome,
      disciplina: turma?.disciplina,
      periodo: turma?.periodo,
      docente: { id: turma.docente?.id, username: turma.docente?.username },
    }));
  }

  async findAllProfessor(docenteId: number) {
    const docente = await this.usersRepo.findOne({ where: { id: docenteId } });

    if (!docente) throw new NotFoundException('Docente não encontrado!');

    if (docente.role !== Role.DOCENTE)
      throw new BadRequestException(
        `Usuários com role ${docente.role} não podem ministrar turmas!`,
      );

    const turmas = await this.turmaRepo.find({
      where: { docente: docente },
      relations: {
        docente: true,
        periodo: true,
        disciplina: true,
      },
    });

    // informações do docente não se repetem
    return {
      docenteId: turmas[0]?.docente.id,
      docenteUsername: turmas[0]?.docente.username,
      turmas: turmas?.map((turma) => ({
        id: turma?.id,
        nome: turma?.nome,
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
    });

    if (!turma) throw new NotFoundException('Turma não encontrada!');

    return {
      id: turma.id,
      nome: turma.nome,
      disciplina: turma.disciplina,
      periodo: turma.periodo,
      docente: { id: turma.docente.id, username: turma.docente.username },
    };
  }

  async update(id: number, updateTurmaDto: UpdateTurmaDto) {
    const turma = await this.turmaRepo.findOne({
      where: { id },
      relations: {
        disciplina: true,
        periodo: true,
        docente: true,
      },
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada!');
    }

    // validação de duplicidade (excluindo ela mesma)
    const exists = await this.turmaRepo.findOne({
      where: {
        nome: updateTurmaDto.nome ?? turma.nome,
        disciplina: { id: updateTurmaDto.disciplinaId ?? turma.disciplina.id },
        periodo: { id: updateTurmaDto.periodoId ?? turma.periodo.id },
        docente: { id: updateTurmaDto.docenteId ?? turma.docente.id },
      },
    });

    if (exists && exists.id !== id) {
      throw new ConflictException('Turma já existe!');
    }

    // valida disciplina
    const disciplina = await this.disciplinaRepo.findOne({
      where: { id: updateTurmaDto.disciplinaId ?? turma.disciplina.id },
    });

    if (!disciplina) {
      throw new NotFoundException('Disciplina não encontrada!');
    }

    // valida periodo
    const periodo = await this.periodoRepo.findOne({
      where: { id: updateTurmaDto.periodoId ?? turma.periodo.id },
    });

    if (!periodo) {
      throw new NotFoundException('Período não encontrado!');
    }

    // valida docente
    let docente = turma.docente;

    if (updateTurmaDto.docenteId) {
      const found = await this.usersRepo.findOne({
        where: { id: updateTurmaDto.docenteId },
      });

      if (!found) {
        throw new NotFoundException('Docente não encontrado!');
      }

      if (found.role !== Role.DOCENTE) {
        throw new BadRequestException(
          `Usuário de role ${found.role} não pode ser docente!`,
        );
      }

      docente = found;
    }

    // aplica update manual
    turma.nome = updateTurmaDto.nome ?? turma.nome;
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
    });

    return {
      id: updated?.id,
      nome: updated?.nome,
      disciplina: updated?.disciplina,
      periodo: updated?.periodo,
      docente: {
        id: updated?.docente?.id,
        username: updated?.docente?.username,
      },
    };
  }

  async remove(id: number) {
    const result = await this.turmaRepo.delete(id);

    if (result.affected === 0)
      throw new NotFoundException('Turma não encontrada!');

    return { success: true, message: 'Turma deletada com sucesso!' };
  }
}
