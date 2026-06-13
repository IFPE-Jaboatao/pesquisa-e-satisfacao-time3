export interface PesquisaSatisfacaoAluno {
    id: string,
    titulo: string,
    descricao: string,
    dataInicio: string,
    dataFinal: string,
    setorId: number,
    nomeSetor: string,
    tipoId: number,
    nomeServico: string,
    status: string
}

export interface PesquisaSatisfacaoGestor {
    id: string,
    titulo: string,
    descricao: string,
    dataInicio: string,
    dataFinal: string,
    setorId: number,
    nomeSetor: string,
    tipoId: number,
    nomeServico: string,
    status: string,
    maximoRespostas: number,
    respostasRecebidas: number
}