import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSetorDto } from './dto/create-setor.dto';
import { UpdateSetorDto } from './dto/update-setor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Setor } from './entities/setor.entity';
import { Not, Repository } from 'typeorm';
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

    const campus = await this.campusRepo.findOne({ where: { id: createSetorDto.campusId }, withDeleted: false });

    if (!campus) {
      throw new NotFoundException('Campus não encontrado!');
    }

    // verifica se já existe um setor com o mesmo nome no mesmo campus
    const exists = await this.setorRepo.findOne({
      where: { nome: createSetorDto.nome, campus: { id: createSetorDto.campusId } },
      withDeleted: false
    });

    if (exists) {
      throw new ConflictException('Setor já existe nesse campus!');
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
      withDeleted: false
    });

  return setores.map((setor) => ({
      id: setor.id,
      nome: setor.nome,
      campusId: setor.campus?.id,
      createdAt: setor.createdAt,
      updatedAt: setor.updatedAt
    }));
  }

  async findOne(id: number) {
    const setor = await this.setorRepo.findOne({where: {id}, relations: {campus: true}, withDeleted: false});

    if (!setor) throw new NotFoundException("Setor não encontrado!")

    return {
      id: setor.id,
      nome: setor.nome,
      campusId: setor.campus?.id,
      createdAt: setor.createdAt,
      updatedAt: setor.updatedAt
    };
  }

  async update(id: number, updateSetorDto: UpdateSetorDto) {
    const setor = await this.setorRepo.findOne({where: {id}, withDeleted: false});

    if (!setor) throw new NotFoundException("Setor não encontrado!")

    const { campusId, ...rest} = updateSetorDto;

    // verifica se já existe um setor com o mesmo nome no mesmo campus (exceto ele mesmo)
    if (updateSetorDto.nome || campusId) {
      const exists = await this.setorRepo.findOne({
        where: {
          nome: updateSetorDto.nome || setor.nome,
          campus: { id: campusId || setor.campus?.id },
          id: Not(id)
        },
        withDeleted: false
      });

      if (exists) {
        throw new ConflictException('Setor já existe nesse campus!');
      }
    }

    await this.setorRepo.save({
      ...setor,
      ...rest,
      campus: campusId ? {id: campusId} : setor.campus,
    });

    const updated = await this.setorRepo.findOne({where: {id}, withDeleted: false});

    return updated
  }

  async remove(id: number) {
    const result = await this.setorRepo.softDelete(id);

    if (result.affected === 0) throw new NotFoundException("Setor não encontrado!")

    return {"success": true, "message": "Setor deletado com sucesso!"};
  }
}
