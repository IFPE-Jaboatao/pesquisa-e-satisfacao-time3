import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { DisciplinaService } from "../disciplina/disciplina.service";
import { DisciplinaDeletedEvent } from "src/shared/events/disciplina-deleted.event";
import { TurmaService } from "../turma/turma.service";

@Injectable()
export class DisciplinaDeletedHandler {
  constructor(
    private readonly turmaService: TurmaService,
  ) {}

  @OnEvent('disciplina.deleted')
  async handle(event: DisciplinaDeletedEvent) {
    // retorna os turmas não deletadas daquela disciplina
    const turmas = await this.turmaService.findByDisciplina(event.disciplinaId);

    // deleta cada turma
    for (const turma of turmas) {
        await this.turmaService.remove(turma.id)
    }
  }
}