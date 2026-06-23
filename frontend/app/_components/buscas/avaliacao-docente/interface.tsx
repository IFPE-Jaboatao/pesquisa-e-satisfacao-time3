export interface AvaliacaoDocenteAluno {
    id: string,
    titulo: string,
    descricao: string,
    status: string,
    tipoId: number,
    dataInicio: string,
    dataFinal: string,
    disciplinaId: number,
    disciplina: string,
    periodoId: number,
    periodo: string,
    docenteId: number,
    docente: string,
    turno: string,
    turmaId: number
}

export interface AvaliacaoDocenteGestor {
    id: string,
    titulo: string,
    descricao: string,
    status: string,
    tipoId: number,
    dataInicio: string,
    dataFinal: string,
    disciplinaId: number,
    disciplina: string,
    periodoId: number,
    periodo: string,
    docenteId: number,
    docente: string,
    turno: string,
    turmaId: number,
    cursoId: number,
    curso: string,
    maximoRespostas: number,
    respostasRecebidas: number
}


export interface AvaliacaoDocenteDocente {
    id: string,
    titulo: string,
    descricao: string,
    status: string,
    tipoId: number,
    dataInicio: string,
    dataFinal: string,
    disciplinaId: number,
    disciplina: string,
    periodoId: number,
    periodo: string,
    docenteId: number,
    docente: string,
    turno: string,
    turmaId: number,
    cursoId: number,
    curso: string,
    maximoRespostas: number,
    respostasRecebidas: number
}