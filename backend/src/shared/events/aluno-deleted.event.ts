export class AlunoDeletedEvent {
  constructor(
    public readonly alunoId: number,

    public readonly campusId: number
  ) {}
}