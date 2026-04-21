import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Repository } from 'typeorm';
import { Campus } from 'src/institutional/campus/entities/campus.entity';
import { Disciplina } from '../disciplina/entities/disciplina.entity';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso, 'mysql')
    private cursoRepo: Repository<Curso>,

    @InjectRepository(Campus, 'mysql')
    private campusRepo: Repository<Campus>
  ) {}


  async create(createCursoDto: CreateCursoDto) {

    const campus = await this.campusRepo.findOne({where:{id: createCursoDto.campusId}});

    if (!campus) throw new NotFoundException("Campus não encontrado!")

    const curso = this.cursoRepo.create({
      nome: createCursoDto.nome,
      campus: campus
    }
    );

    return this.cursoRepo.save(curso);
  }

  async findAll(campusId?: number) {
    const cursos = await this.cursoRepo.find({
      where: campusId ? { campus: { id:campusId } } : {},
      relations: { campus: true },
    })

    return cursos.map((curso) => ({
      id: curso.id,
      nome: curso.nome,
      campusId: curso.campus?.id,
      disciplinas: curso.disciplinas
    }));
  }

  async findOne(id: number) {
    const curso = await this.cursoRepo.findOne({where: {id}, relations: {campus: true}})

    if (!curso) throw new NotFoundException("Curso não encontrado!")

    return {
      id: curso.id,
      nome: curso.nome,
      campusId: curso.campus?.id,
      disciplinas: curso.disciplinas
    };
  }

  async update(id: number, updateCursoDto: UpdateCursoDto) {
    const curso = await this.cursoRepo.findOne({where: {id}})

    if (!curso) throw new NotFoundException("Curso não encontrado!")

    const { campusId, ...rest} = updateCursoDto;

    await this.cursoRepo.save({
      ...curso,
      ...rest,
      campus: campusId ? {id: campusId} : curso.campus,
    })

    const updated = await this.cursoRepo.findOne({where: {id}, relations: {campus: true}})
    
    return {
      id: updated?.id,
      nome: updated?.nome,
      campusId: updated?.campus?.id
    };
  }

  async remove(id: number) {
    const curso = await this.cursoRepo.findOne({where: {id}})

    if (!curso) throw new NotFoundException("Curso não encontrado!")

    const result = await this.cursoRepo.delete(id);

    if (result.affected === 0) throw new NotFoundException("Curso não encontrado!")

    return {"success": true, "message": "Curso deletado com sucesso!"};
  }
}
