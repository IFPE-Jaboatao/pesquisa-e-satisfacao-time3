import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { In, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Campus } from './entities/campus.entity';

@Injectable()
export class CampusService {
  constructor(
    @InjectRepository(Campus, 'mysql')
    private campusRepo: Repository<Campus>,
  ) {}

  // criar campus vazio
  async create(dto: CreateCampusDto) {

    // verificar se já existe um campus com a mesma cidade (não inclui deletados)
    if (dto.cidade) {
      const existing = await this.campusRepo.findOne({ where: { cidade: dto.cidade }, withDeleted: false });
      
      if (existing) {
        throw new ConflictException("Já existe um campus com essa cidade!");
      }
    }

    const campus = this.campusRepo.create({
      nome: dto.nome,
      cidade: dto.cidade
    });

    return this.campusRepo.save(campus);
  }

  // listar todos os campi
  async findAll() {
    return this.campusRepo.find();
  }

  // listar todos os campi deletados
  async findAllDeleted() {
    return this.campusRepo.find({ where: { deletedAt: Not(IsNull()) }, withDeleted: true });
  }

  // buscar um campus
  async findOne(id: number) {
    const campus = this.campusRepo.findOne({ where: { id } });

    if (!campus) throw new NotFoundException("Campus não encontrado!")

    return campus;
  }

  // buscar um campus e seus filhos
  async findOneFull(id: number) {
    const campus = this.campusRepo.findOne({ where: { id },
    relations: {
      setores: {
        servicos: true
      }
    } });

    if (!campus) throw new NotFoundException("Campus não encontrado!")

    return campus;
  }

  // atualizar um campus
  async update(id: number, updateCampusDto: UpdateCampusDto) {

    // verificar se a cidade já existe em outro campus (não inclui deletados)
    if (updateCampusDto.cidade) {
      const existing = await this.campusRepo.findOne({ where: { cidade: updateCampusDto.cidade, id: Not(id) }, withDeleted: false });
      
      if (existing) {
        throw new ConflictException("Já existe um campus com essa cidade!");
      }
    }

    await this.campusRepo.update(id, updateCampusDto)

    const updated = await this.campusRepo.findOne({where:{id}})

    if (!updated) {
      throw new NotFoundException("Campus não encontrado!")
    }

    return updated;
  }

  // remover um campus
  async remove(id: number) {
    const campus = await this.campusRepo.findOne({where: {id}});

    if (!campus) throw new NotFoundException("Campus não encontrado!");

    const result = await this.campusRepo.softDelete(id);

    if (result.affected === 0) throw new NotFoundException("Campus não encontrado!");

    return {"success": true, "message": "Campus deletado com sucesso!"};
  }
}
