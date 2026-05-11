import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Periodo } from './entities/periodo.entity';
import { LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PeriodoDeletedEvent } from 'src/shared/events/periodo-deleted.event';
import { FindOptionsUtils } from 'typeorm/browser';
import { createSecretKey } from 'crypto';

@Injectable()
export class PeriodoService {
  constructor(
  @InjectRepository(Periodo, 'mysql')
  private periodoRepo: Repository<Periodo>,

  private readonly eventEmitter: EventEmitter2
  ) {}

  async create(createPeriodoDto: CreatePeriodoDto) {
    // verificar se já existe um período com ano e semestre iguais
    const exists = await this.periodoRepo.findOne({
      where: {ano: createPeriodoDto.ano, semestre: createPeriodoDto.semestre},
      withDeleted: false
    });

    if (exists) throw new ConflictException("Período já existe!");

    // verificar se existe um período anterior
    // e verificar startDate atual com endDate anterior
    const periodoAnt = await this.periodoRepo.findOne({
      where: {
        ano: createPeriodoDto.semestre === 1 ? LessThan(createPeriodoDto.ano) : LessThanOrEqual(createPeriodoDto.ano)},
      order: {
        ano: 'DESC',
        semestre: 'DESC'
      },
      withDeleted: false
    })

    if (periodoAnt) {
      const dateCheck1 = periodoAnt.endDate < createPeriodoDto.startDate;

      if (!dateCheck1) {
        throw new ConflictException(`O periodo anterior termina em ${periodoAnt.endDate}, então um período subsequente não pode começar em ${createPeriodoDto.startDate}.`)
      }
    }

    // verificar se existe periodo posterior 
    // e verificar endDate atual com startDate posterior
    const periodoPos = await this.periodoRepo.findOne({
      where: {
        ano: createPeriodoDto.semestre === 2 ? MoreThan(createPeriodoDto.ano) : MoreThanOrEqual(createPeriodoDto.ano)},
      order: {
        ano: 'ASC',
        semestre: 'ASC'
      },
      withDeleted: false
    })

    if (periodoPos) {
      const dateCheck2 = periodoPos.startDate > createPeriodoDto.endDate;

      if (!dateCheck2) {
        throw new ConflictException(`O periodo subsequente começa em ${periodoPos.startDate}, então um período anterior a ele não pode terminar em ${createPeriodoDto.endDate}.`)
      }
  }

    const periodo = this.periodoRepo.create({
      ano: createPeriodoDto.ano,
      semestre: createPeriodoDto.semestre,
      startDate: createPeriodoDto.startDate,
      endDate: createPeriodoDto.endDate
    });

    return await this.periodoRepo.save(periodo);
  }

  async findAll() {
    return await this.periodoRepo.find({ withDeleted: false });
  }

  async findOne(id: number) {
    const periodo = await this.periodoRepo.findOne({ where: { id }, withDeleted: false });

    if (!periodo) throw new NotFoundException("Período não encontrado!")

    return periodo;
  }

  async update(id: number, updatePeriodoDto: UpdatePeriodoDto) {
    // verifica se o período existe
    const periodo = await this.periodoRepo.findOne({ where: { id }, withDeleted: false });

    if (!periodo) throw new NotFoundException("Período não encontrado!");

    // verifica se já existe outro período com ano, semestre iguais (exceto ele mesmo)
    const exists = await this.periodoRepo.findOne({
      where: {
        ano: updatePeriodoDto?.ano || periodo.ano,
        semestre: updatePeriodoDto?.semestre || periodo.semestre,
        id: Not(id)
      },
      withDeleted: false
    });

    if (exists) throw new ConflictException("Período já existe!");

    // // execução de validações manuais para campos relacionados (que dependem de outros campos)

    // Diferença de meses
    const startDate = updatePeriodoDto.startDate ? new Date(updatePeriodoDto.startDate) : new Date(periodo.startDate);
    const endDate = updatePeriodoDto.endDate ? new Date(updatePeriodoDto.endDate) : new Date(periodo.endDate);

    const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());

    if (monthsDiff > 7) {
      throw new BadRequestException("endDate deve ser no máximo 7 meses após startDate!");
    }

    // startDate deve ser anterior a endDate
    if (startDate >= endDate) {
      throw new BadRequestException("startDate deve ser anterior a endDate!");
    }

    // ano deve ser no mesmo ano de startDate ou pelo menos 1 ano antes ou depois
    const ano = updatePeriodoDto.ano ?? periodo.ano;

    // não é afetado pela timezone
    if (startDate.getUTCFullYear() - 1 > ano || startDate.getUTCFullYear() + 1 < ano) {
      throw new BadRequestException("Ano deve ser no mesmo ano de startDate ou pelo menos 1 ano antes ou depois!");
    }

    // update manual
    if (periodo) {
      periodo.ano = updatePeriodoDto.ano ?? periodo.ano;
      periodo.semestre = updatePeriodoDto.semestre ?? periodo.semestre;
      periodo.startDate = updatePeriodoDto.startDate ?? periodo.startDate; 
      periodo.endDate = updatePeriodoDto.endDate ?? periodo.endDate;
    }

    await this.periodoRepo.save(periodo);

    const updated = await this.periodoRepo.findOne({where:{id}, withDeleted: false})

    if (!updated) {
      throw new NotFoundException("Período não atualizado!")
    }

    return updated;
  }

  async remove(id: number) {
    // impede update de deletedAt indevidamente
    const periodo = await this.periodoRepo.findOne({where: {id: id}, withDeleted:false})

    if (!periodo) throw new NotFoundException("Período não encontrado!");

    const result = await this.periodoRepo.softDelete(id);

    if (result.affected === 0) throw new NotFoundException("Período não encontrado!");

    // emite event pra deletar turmas associadas ao período
    this.eventEmitter.emit(
      'periodo.deleted',
      new PeriodoDeletedEvent(periodo.id)
    )

    return {"success": true, "message": "Período deletado com sucesso!"};
  }
}
