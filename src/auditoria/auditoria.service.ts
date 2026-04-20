import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Auditoria } from './entities/auditoria.entity';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria, 'mongo')
    private readonly repo: MongoRepository<Auditoria>,
  ) {}

  // Método para registrar qualquer alteração
  async registrar(log: Partial<Auditoria>) {
    const novoLog = this.repo.create(log);
    return await this.repo.save(novoLog);
  }

  // Busca logs de uma pesquisa específica para o ADMIN ver
  async listarPorEntidade(entidadeId: string) {
    return await this.repo.find({
      where: { entidadeId },
      order: { timestamp: 'DESC' },
    });
  }
}