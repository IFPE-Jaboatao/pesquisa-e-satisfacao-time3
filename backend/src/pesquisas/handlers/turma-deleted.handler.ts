import { Injectable } from '@nestjs/common'; // ou o framework que estiver usando
import { OnEvent } from '@nestjs/event-emitter';
import { PesquisasService } from '../pesquisas.service';
import { Tipo } from '../pesquisa-tipo.enum';

@Injectable()
export class TurmaDeletedHandlerPesquisa {
  constructor(
    
    private readonly pesquisasService: PesquisasService,
  ) {}

  @OnEvent('turma.deleted')
  async handleTurmaDeletedEvent(payload: { turmaId: number }) {
    const { turmaId } = payload;

    await this.pesquisasService.softDelete(turmaId, Tipo.AVALIACAO);
    
  }
}