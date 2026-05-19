import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RespostasService } from '../respostas.service';
import { MatriculaDeletedEvent } from 'src/shared/events/matricula-deleted.event';

@Injectable()
export class MatriculaDeletedHandlerResposta {
  constructor(
    
    private readonly respostasService: RespostasService,
  ) {}

  @OnEvent('matricula.deleted')
  async handlePesquisaDeletedEvent(payload: MatriculaDeletedEvent) {
    // ordem correta dos itens para softDeleteByMatricula()
    await this.respostasService.softDeleteByMatricula(payload.turmaId, payload.alunoId);
    
  }
}