import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RespostasService } from '../respostas.service';
import { PesquisaDeletedEvent } from 'src/shared/events/pesquisa-deleted.event';

@Injectable()
export class PesquisaDeletedHandlerResposta {
  constructor(
    
    private readonly respostasService: RespostasService,
  ) {}

  @OnEvent('pesquisa.deleted')
  async handlePesquisaDeletedEvent(payload: PesquisaDeletedEvent) {

    await this.respostasService.softDelete(payload.pesquisasIds);
    
  }
}