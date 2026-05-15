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

    await this.respostasService.softDeleteByMatricula(payload.alunoId, payload.turmaId);
    
  }
}