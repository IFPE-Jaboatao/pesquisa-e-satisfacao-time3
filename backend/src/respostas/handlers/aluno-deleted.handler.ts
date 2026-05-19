

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RespostasService } from '../respostas.service';
import { AlunoDeletedEvent } from 'src/shared/events/aluno-deleted.event';

@Injectable()
export class AlunoDeletedHandlerResposta {
  constructor(
    
    private readonly respostasService: RespostasService,
  ) {}

  @OnEvent('aluno.deleted')
  async handlePesquisaDeletedEvent(payload: AlunoDeletedEvent) {

    await this.respostasService.softDeleteByAlunoCampus(payload.alunoId, payload.campusId);
    
  }
}