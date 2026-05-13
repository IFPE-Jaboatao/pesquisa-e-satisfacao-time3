import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { CursoDeletedEvent } from "src/shared/events/curso-deleted.event";
import { DisciplinaService } from "../disciplina/disciplina.service";

@Injectable()
export class CursoDeletedHandler {
  constructor(
    private readonly disciplinaService: DisciplinaService,
  ) {}

  @OnEvent('curso.deleted')
  async handle(event: CursoDeletedEvent) {
    // retorna os disciplinas não deletados daquele curso
    const disciplinas = await this.disciplinaService.findByCurso(event.cursoId);

    // deletando cada disciplina
    for (const disciplina of disciplinas) {
        await this.disciplinaService.remove(disciplina.id)
    }
  }
}