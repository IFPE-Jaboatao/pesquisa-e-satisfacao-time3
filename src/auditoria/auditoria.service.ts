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

  /**
   * Registra alterações no MongoDB para fins de rastreabilidade técnica.
   * 
   */
  async registrar(log: Partial<Auditoria>) {
    console.log('[AUDITORIA] Preparando dados para persistência...');
    
    const dadosComData = { 
      ...log, 
      timestamp: log.timestamp || new Date() 
    };
    
    const novoLog = this.repo.create(dadosComData);
    const salvo = await this.repo.save(novoLog);

    console.log('[AUDITORIA] Log persistido com sucesso no MongoDB.');

    return salvo;
  }

  /**
   * Busca logs de uma pesquisa específica para o ADMIN
   */
  async listarPorEntidade(entidadeId: string) {
    return await this.repo.find({
      where: { entidadeId },
      order: { timestamp: 'DESC' },
    });
  }

  /**
   * Método auxiliar para listar todos os logs registrados no sistema
   */
  async findAll() {
    return await this.repo.find({ order: { timestamp: 'DESC' } });
  }
}