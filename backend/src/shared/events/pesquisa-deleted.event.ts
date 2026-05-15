export class PesquisaDeletedEvent {
  constructor(
    public readonly pesquisasIds: Array<string>,
  ) {}
}