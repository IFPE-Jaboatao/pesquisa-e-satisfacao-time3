import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Auditoria } from './entities/auditoria.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria, 'mongo')
    private readonly repo: MongoRepository<Auditoria>,

    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Método para registrar qualquer alteração e disparar notificações
   */
  async registrar(log: Partial<Auditoria>) {
    console.log('[PASSO 4] AuditoriaService: Preparando dados para persistência...');
    
    // Garante que o timestamp seja gerado agora
    const dadosComData = { 
      ...log, 
      timestamp: log.timestamp || new Date() 
    };
    
    const novoLog = this.repo.create(dadosComData);
    const salvo = await this.repo.save(novoLog);

    console.log('[PASSO 5] AuditoriaService: Log salvo no MongoDB com sucesso.');

    // Dispara o evento para o NotificacoesService
    // Passamos o objeto 'salvo' que já contém o ID gerado pelo MongoDB e os dados da pesquisa
    const temOuvinte = this.eventEmitter.emit('notificacao.criada', salvo);

    console.log(`[PASSO 6] AuditoriaService: Evento "notificacao.criada" disparado.`);
    console.log(`[STATUS] Alguém ouviu o evento? ${temOuvinte ? 'SIM ✅' : 'NÃO ❌ (Verifique o NotificacoesModule)'}`);

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
   * Método auxiliar para listar todos os logs
   */
  async findAll() {
    return await this.repo.find({ order: { timestamp: 'DESC' } });
  }
}