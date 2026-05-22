export class MatriculaDeletedEvent {
  constructor(
    public readonly turmaId: number,

    public readonly alunoId: number,
  ) {}
}