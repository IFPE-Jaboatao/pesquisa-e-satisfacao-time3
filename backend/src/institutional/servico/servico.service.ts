import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Setor } from '../setor/entities/setor.entity';
import { Not, Repository } from 'typeorm';
import { Servico } from './entities/servico.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServicoDeletedEvent } from 'src/shared/events/servico-deleted.event';

@Injectable()
export class ServicoService {
  constructor(
    @InjectRepository(Servico, 'mysql')
    private servicoRepo: Repository<Servico>,

    @InjectRepository(Setor, 'mysql')
    private setorRepo: Repository<Setor>,

    private readonly eventEmitter: EventEmitter2
  ) {}


  // criar serviço com setorId
  async create(createServicoDto: CreateServicoDto) {

    const setor = await this.setorRepo.findOne({ where: { id: createServicoDto.setorId }, withDeleted: false });

    if (!setor) {
      throw new NotFoundException('Setor não encontrado!');
    }

    // verifica se já existe um serviço com o mesmo nome no mesmo setor
    const exists = await this.servicoRepo.findOne({
      where: { nome: createServicoDto.nome, setor: { id: createServicoDto.setorId } },
      withDeleted: false
    });

    if (exists) {
      throw new ConflictException('Serviço já existe nesse setor!');
    }

    const servico = this.servicoRepo.create({
      nome: createServicoDto.nome,
      setor: setor
    })

    return this.servicoRepo.save(servico);
  }


  // retornar todos os serviços
  async findAll(setorId?: number) {
    const servicos = await this.servicoRepo.find({
      where: setorId ? { setor: { id: setorId } } : {},
      relations: { setor: true },
      withDeleted: false
      });

    return servicos.map((servico) => ({
      id: servico.id,
      nome: servico.nome,
      setorId: servico.setor?.id,
      createdAt: servico.createdAt,
      updatedAt: servico.updatedAt
      }));

  }

  // retornar um serviço com setor
  async findOne(id: number) {
    const servico = await this.servicoRepo.findOne({ where: {id}, relations: {setor: { campus: true } }, withDeleted: false });

    if (!servico) throw new NotFoundException('Serviço não encontrado!')

    return {
      id: servico.id,
      nome: servico.nome,
      setor: servico.setor,
      campus: servico.setor?.campus,
      createdAt: servico.createdAt,
      updatedAt: servico.updatedAt
    };
    }

        // função auxiliar para soft delete cascade vindo de setor
  async findBySetor(setorId: number) {
    // retorna os servicos do setor deletado
    const todosServicos = await this.servicoRepo.find({
      where: { setor: { id:setorId } }, withDeleted: true })

      // retorna apenas servicos que não foram deletados
    return todosServicos.filter((c) => c.deletedAt === null)
  }

  // função auxiliar para buscar serviços por campus
  async servicosByCampus(campusId: number) {
    const servicos = await this.servicoRepo.find({
      where: { setor: { campus: { id: campusId } } },
      relations: { setor: { campus: true } },
      withDeleted: false
    });

    return servicos.map((servico) => ({
      id: servico.id,
      nome: servico.nome,
      setorId: servico.setor?.id
    }));
  }

  async update(id: number, updateServicoDto: UpdateServicoDto) {
      const servico = await this.servicoRepo.findOne({where: {id}, withDeleted: false});
  
      if (!servico) throw new NotFoundException("Serviço não encontrado!")

      const { setorId, ...rest} = updateServicoDto;

      // verifica se já existe um serviço com o mesmo nome no mesmo setor
      const exists = await this.servicoRepo.findOne({
          where: { nome: rest.nome, setor: { id: setorId }, id: Not(id) },
          withDeleted: false
        });

      if (exists) {
        throw new ConflictException('Serviço já existe nesse setor!');
      }

      const setor = await this.setorRepo.findOne({where:{id: setorId}, withDeleted: false});

      if (!setor) throw new NotFoundException("Setor inválido!");

      await this.servicoRepo.save({
        ...servico,
        ...rest,
        setor: setorId ? {id: setorId} : servico.setor,
      });

      const updated = await this.servicoRepo.findOne({where: {id}, relations: {setor : true}, withDeleted: false});
  
      return updated;
    }

    // deletar um serviço
  async remove(id: number) {
    // impedir update de deletedAt indevidamente
    const servico = await this.servicoRepo.findOne({where: {id: id}, withDeleted: false})

    if (!servico) throw new NotFoundException("Serviço não encontrado!")

    const result = await this.servicoRepo.softDelete({id});

    if (result.affected === 0) throw new NotFoundException("Serviço não encontrado!")

    // evento emitado para deletar pesquisas de satisfação desse serviço
    this.eventEmitter.emit(
      'servico.deleted',
      new ServicoDeletedEvent(servico.id)
    )

    return {"success": true, "message": "Serviço deletado com sucesso!"};
  }
}
