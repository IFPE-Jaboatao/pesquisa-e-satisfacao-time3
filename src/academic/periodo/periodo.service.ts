import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Periodo } from './entities/periodo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PeriodoService {
  constructor(
  @InjectRepository(Periodo, 'mysql')
  private periodoRepo: Repository<Periodo>,
  ) {}

  async create(createPeriodoDto: CreatePeriodoDto) {
    const exists = await this.periodoRepo.findOne({
      where: {ano: createPeriodoDto.ano, semestre: createPeriodoDto.semestre}
    });

    if (exists) throw new ConflictException("Período já existe!")

    const periodo = this.periodoRepo.create({
      ano: createPeriodoDto.ano,
      semestre: createPeriodoDto.semestre
    });

    return this.periodoRepo.save(periodo);
  }

  async findAll() {
    return await this.periodoRepo.find();
  }

  async findOne(id: number) {
    const periodo = await this.periodoRepo.findOne({ where: { id } });

    if (!periodo) throw new NotFoundException("Período não encontrado!")

    return periodo;
  }

  async update(id: number, updatePeriodoDto: UpdatePeriodoDto) {
    const exists = await this.periodoRepo.findOne({
      where: {ano: updatePeriodoDto.ano, semestre: updatePeriodoDto.semestre}
    });

    if (exists) throw new ConflictException("Período já existe!")

    await this.periodoRepo.update(id, updatePeriodoDto)

    const updated = await this.periodoRepo.findOne({where:{id}})

    if (!updated) {
      throw new NotFoundException("Período não encontrado!")
    }

    return updated;
  }

  async remove(id: number) {
    const result = await this.periodoRepo.delete(id);

    if (result.affected === 0) throw new NotFoundException("Período não encontrado!");

    return {"success": true, "message": "Período deletado com sucesso!"};
  }
}
