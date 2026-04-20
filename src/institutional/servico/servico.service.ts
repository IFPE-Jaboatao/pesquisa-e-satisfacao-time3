import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Setor } from '../setor/entities/setor.entity';
import { Repository } from 'typeorm';
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

    const setor = await this.setorRepo.findOne({ where: { id: createServicoDto.setorId } });

    if (!setor) {
      throw new NotFoundException('Setor não encontrado!');
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
      });

    return servicos.map((servico) => ({
      id: servico.id,
      nome: servico.nome,
      setorId: servico.setor?.id
      }));

  }

  // retornar um serviço com setor
  async findOne(id: number) {
    const servico = await this.servicoRepo.findOne({ where: {id}, relations: {setor: true}})

    if (!servico) throw new NotFoundException('Serviço não encontrado!')

    return {
      id: servico.id,
      nome: servico.nome,
      setorId: servico.setor?.id
    };
  }

  async update(id: number, updateServicoDto: UpdateServicoDto) {
      const servico = await this.servicoRepo.findOne({where: {id}});
  
      if (!servico) throw new NotFoundException("Serviço não encontrado!")

      const { setorId, ...rest} = updateServicoDto;

      const setor = await this.setorRepo.findOne({where:{id: setorId}});

      if (!setor) throw new NotFoundException("Setor inválido!");

      await this.servicoRepo.save({
        ...servico,
        ...rest,
        setor: setorId ? {id: setorId} : servico.setor,
      });

      const updated = await this.servicoRepo.findOne({where: {id}, relations: {setor : true}})
  
      return updated;
    }

    // deletar um serviço
  async remove(id: number) {

    const servico = await this.servicoRepo.findOne({where: {id}});

    if (!servico) throw new NotFoundException("Serviço não encontrado!");

    const result = await this.servicoRepo.delete({id});

    if (result.affected === 0) throw new NotFoundException("Serviço não encontrado!")

    return {"success": true, "message": "Serviço deletado com sucesso!"};
  }
}
