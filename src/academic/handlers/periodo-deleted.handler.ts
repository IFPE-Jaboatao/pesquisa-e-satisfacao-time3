import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { TurmaService } from "../turma/turma.service";
import { PeriodoDeletedEvent } from "src/shared/events/periodo-deleted.event";

@Injectable()
export class PeriodoDeletedHandler {
  constructor(
    private readonly turmaService: TurmaService,
  ) {}

  @OnEvent('periodo.deleted')
  async handle(event: PeriodoDeletedEvent) {
    // retorna os turmas não deletadas daquela disciplina
    const turmas = await this.turmaService.findByPeriodo(event.periodoId);
    
    // deleta cada turma
    for (const turma of turmas) {
        await this.turmaService.remove(turma.id)
    }
  }
}