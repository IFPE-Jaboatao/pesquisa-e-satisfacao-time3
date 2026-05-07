import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Disciplina } from './entities/disciplina.entity';
import { Repository } from 'typeorm';
import { Curso } from '../curso/entities/curso.entity';
import { DisciplinaDeletedEvent } from 'src/shared/events/disciplina-deleted.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DisciplinaService {
  constructor(
    @InjectRepository(Disciplina, 'mysql')
    private disciplinaRepo: Repository<Disciplina>,

    @InjectRepository(Curso, 'mysql')
    private cursoRepo: Repository<Curso>,

    private readonly eventEmitter: EventEmitter2
  ) {}

  async create(createDisciplinaDto: CreateDisciplinaDto) {
    const curso = await this.cursoRepo.findOne({ where: { id: createDisciplinaDto.cursoId }, withDeleted: false });

   if (!curso) {
      throw new NotFoundException('Curso não encontrado!');
    }

    // verifica se já existe um curso com o mesmo nome, código e curso (não inclui deletados)
    const existing = await this.disciplinaRepo.findOne(
      { where: 
        { nome: createDisciplinaDto.nome,
          codigo: createDisciplinaDto.codigo,
          curso: { 
            id: createDisciplinaDto.cursoId 
          } },
          withDeleted: false });

    if (existing) {
      throw new NotFoundException("Já existe uma disciplina com esse nome e código nesse curso!");
    }

    const disciplina = this.disciplinaRepo.create({
      nome: createDisciplinaDto.nome,
      codigo: createDisciplinaDto.codigo,
      curso: curso
    });

    return this.disciplinaRepo.save(disciplina);
  }

  async findAll(cursoId?: number) {
    const disciplinas = await this.disciplinaRepo.find({
      where: cursoId ? { curso: { id: cursoId } } : {},
      relations: { curso: true },
      withDeleted: false
    });

  return disciplinas.map((disciplina) => ({
      id: disciplina.id,
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      cursoId: disciplina.curso?.id,
      createdAt: disciplina.createdAt,
      updatedAt: disciplina.updatedAt
    }));
  }
  
    // função auxiliar para soft delete cascade vindo de curso
   async findByCurso(cursoId?: number) {
      const todasDisicplinas = await this.disciplinaRepo.find({
      where: { curso: { id:cursoId } }, withDeleted: true })

      // retorna apenas disciplinas que não foram deletados
    return todasDisicplinas.filter((c) => c.deletedAt === null)
  }

  async findOne(id: number) {
   const disciplina = await this.disciplinaRepo.findOne({where: {id}, relations: {curso: true}});

    if (!disciplina) throw new NotFoundException("Disciplina não encontrada!")

    return {
      id: disciplina.id,
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      cursoId: disciplina.curso?.id,
      createdAt: disciplina.createdAt,
      updatedAt: disciplina.updatedAt
    };
  }

  async update(id: number, updateDisciplinaDto: UpdateDisciplinaDto) {
    const disciplina = await this.disciplinaRepo.findOne({where: {id}, withDeleted: false});

    if (!disciplina) throw new NotFoundException("Disciplina não encontrada!")

    // verifica se já existe uma disciplina com o mesmo nome, código e curso (não inclui deletados)
    if (updateDisciplinaDto.nome || updateDisciplinaDto.codigo || updateDisciplinaDto.cursoId) {
      const existing = await this.disciplinaRepo.findOne({
        where: {
          nome: updateDisciplinaDto.nome,
          codigo: updateDisciplinaDto.codigo,
          curso: { id: updateDisciplinaDto.cursoId }
        },
        withDeleted: false
      });

      if (existing) {
        throw new NotFoundException("Já existe uma disciplina com esse nome e/ou código nesse curso!");
      }
    }

    const { cursoId, ...rest} = updateDisciplinaDto;

    await this.disciplinaRepo.save({
      ...disciplina,
      ...rest,
      curso: cursoId ? {id: cursoId} : disciplina.curso,
    });

    const updated = await this.disciplinaRepo.findOne({where: {id}, withDeleted: false, relations: {
      curso: true
    }});

    return {
      id: updated?.id,
      nome: updated?.nome,
      codigo: updated?.codigo,
      cursoId: updated?.curso?.id,
      createdAt: updated?.createdAt,
      updatedAt: updated?.updatedAt
    };
  }

  async remove(id: number) {
    const disciplina = await this.disciplinaRepo.findOne({where: {id}, withDeleted: false});

    if (!disciplina) throw new NotFoundException("Disciplina não encontrada!")

    const result = await this.disciplinaRepo.softDelete(id);

    if (result.affected === 0) throw new NotFoundException("Disciplina não encontrada!")

    // evento emitado para deletar disciplinas do curso
    this.eventEmitter.emit(
      'disciplina.deleted',
      new DisciplinaDeletedEvent(disciplina.id)
    )

    return {"success": true, "message": "Disciplina deletada com sucesso!"};
  }
}
