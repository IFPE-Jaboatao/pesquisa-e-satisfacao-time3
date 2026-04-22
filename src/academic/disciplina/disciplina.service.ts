import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Disciplina } from './entities/disciplina.entity';
import { Repository } from 'typeorm';
import { Curso } from '../curso/entities/curso.entity';

@Injectable()
export class DisciplinaService {
  constructor(
    @InjectRepository(Disciplina, 'mysql')
    private disciplinaRepo: Repository<Disciplina>,

    @InjectRepository(Curso, 'mysql')
    private cursoRepo: Repository<Curso>,
  ) {}

  async create(createDisciplinaDto: CreateDisciplinaDto) {
    const curso = await this.cursoRepo.findOne({ where: { id: createDisciplinaDto.cursoId } });

   if (!curso) {
      throw new NotFoundException('Curso não encontrado!');
    }

    const disciplina = this.disciplinaRepo.create({
      nome: createDisciplinaDto.nome,
      curso: curso
    });

    return this.disciplinaRepo.save(disciplina);
  }

  async findAll(cursoId?: number) {
    const disciplinas = await this.disciplinaRepo.find({
      where: cursoId ? { curso: { id: cursoId } } : {},
      relations: { curso: true },
    });

  return disciplinas.map((disciplina) => ({
      id: disciplina.id,
      nome: disciplina.nome,
      cursoId: disciplina.curso?.id
    }));
  }

  async findOne(id: number) {
   const disciplina = await this.disciplinaRepo.findOne({where: {id}, relations: {curso: true}});

    if (!disciplina) throw new NotFoundException("Disciplina não encontrada!")

    return {
      id: disciplina.id,
      nome: disciplina.nome,
      cursoId: disciplina.curso?.id
    };
  }

  async update(id: number, updateDisciplinaDto: UpdateDisciplinaDto) {
    const disciplina = await this.disciplinaRepo.findOne({where: {id}});

    if (!disciplina) throw new NotFoundException("Disciplina não encontrado!")

    const { cursoId, ...rest} = updateDisciplinaDto;

    await this.disciplinaRepo.save({
      ...disciplina,
      ...rest,
      curso: cursoId ? {id: cursoId} : disciplina.curso,
    });

    const updated = await this.disciplinaRepo.findOne({where: {id}, relations: {
      curso: true
    }});

    return {
      id: updated?.id,
      nome: updated?.nome,
      cursoId: updated?.curso?.id
    };
  }

  async remove(id: number) {
    const result = await this.disciplinaRepo.delete(id);

    if (result.affected === 0) throw new NotFoundException("Disciplina não encontrada!")

    return {"success": true, "message": "Disciplina deletada com sucesso!"};
  }
}
