import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSetorDto } from './dto/create-setor.dto';
import { UpdateSetorDto } from './dto/update-setor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Setor } from './entities/setor.entity';
import { Repository } from 'typeorm';
import { Campus } from '../campus/entities/campus.entity';


@Injectable()
export class SetorService {

  constructor(
  @InjectRepository(Setor, 'mysql')
  private setorRepo: Repository<Setor>,

  @InjectRepository(Campus, 'mysql')
  private campusRepo: Repository<Campus>
  ) {}

  async create(createSetorDto: CreateSetorDto) {

    const campus = await this.campusRepo.findOne({ where: { id: createSetorDto.campusId } });

    if (!campus) {
      throw new NotFoundException('Campus não encontrado!');
    }

    const setor = this.setorRepo.create({
      nome: createSetorDto.nome,
      campus: campus
    });

    return this.setorRepo.save(setor);
  }

  async findAll(campusId?: number) {
    const setores = await this.setorRepo.find({
      where: campusId ? { campus: { id: campusId } } : {},
      relations: { campus: true },
    });

  return setores.map((setor) => ({
      id: setor.id,
      nome: setor.nome,
      campusId: setor.campus?.id
    }));
  }

  async findOne(id: number) {
    const setor = await this.setorRepo.findOne({where: {id}, relations: {campus: true}});

    if (!setor) throw new NotFoundException("Setor não encontrado!")

    return {
      id: setor.id,
      nome: setor.nome,
      campusId: setor.campus?.id
    };
  }

  async update(id: number, updateSetorDto: UpdateSetorDto) {
    const setor = await this.setorRepo.findOne({where: {id}});

    if (!setor) throw new NotFoundException("Setor não encontrado!")

    const { campusId, ...rest} = updateSetorDto;

    await this.setorRepo.save({
      ...setor,
      ...rest,
      campus: campusId ? {id: campusId} : setor.campus,
    });

    const updated = await this.setorRepo.findOne({where: {id}});

    return updated
  }

  async remove(id: number) {
    const setor = await this.setorRepo.findOne({where: {id}})

    if (!setor) throw new NotFoundException("Setor não encontrado!")

    const result = await this.setorRepo.delete(id);

    if (result.affected === 0) throw new NotFoundException("Setor não encontrado!")

    return {"success": true, "message": "Setor deletado com sucesso!"};
  }
}
