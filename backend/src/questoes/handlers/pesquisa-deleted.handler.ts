import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { QuestoesService } from '../questoes.service';
import { PesquisaDeletedEvent } from 'src/shared/events/pesquisa-deleted.event';

@Injectable()
export class PesquisaDeletedHandlerQuestao {
  constructor(
    
    private readonly questoesService: QuestoesService,
  ) {}

  @OnEvent('pesquisa.deleted')
  async handlePesquisaDeletedEvent(payload: PesquisaDeletedEvent) {

    await this.questoesService.softDelete(payload.pesquisasIds);
    
  }
}