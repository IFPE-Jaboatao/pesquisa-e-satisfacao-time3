import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Setor } from '../setor/entities/setor.entity';
import { Not, Repository } from 'typeorm';
import { Servico } from './entities/servico.entity';

@Injectable()
export class ServicoService {
  constructor(
    @InjectRepository(Servico, 'mysql')
    private servicoRepo: Repository<Servico>,

    @InjectRepository(Setor, 'mysql')
    private setorRepo: Repository<Setor>,
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
    const servico = await this.servicoRepo.findOne({ where: {id}, relations: {setor: true}, withDeleted: false });

    if (!servico) throw new NotFoundException('Serviço não encontrado!')

    return {
      id: servico.id,
      nome: servico.nome,
      setorId: servico.setor?.id,
      createdAt: servico.createdAt,
      updatedAt: servico.updatedAt
    };
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
    const result = await this.servicoRepo.softDelete({id});

    if (result.affected === 0) throw new NotFoundException("Serviço não encontrado!")

    return {"success": true, "message": "Serviço deletado com sucesso!"};
  }
}
