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
    turmaId: number,
    curso: string
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

export interface RelatorioPesquisaGestor {
    pesquisa: {
        id: string,
        titulo: string,
        descricao: string,
        dataInicio: string,
        dataFinal: string,
        tipo: string,
        campusId: number,
        status: string,
        questoes: {
            id: string,
            pergunta: string,
            tipo: string,
            escalaMax?: number,
            opcoes?: string[]
        }[],
    },
    respostas: {
        id: string,
        pesquisaId: string,
        respostas: {
            questaoId: string,
            valor: string
        }[]
    }[],
    estatisticas: {
        totalQuestoes: number,
        totalParticipantes: number
    }
}

export interface PesquisaAluno {
    id: string,
    titulo: string,
    descricao: string,
    dataInicio: string,
    dataFinal: string,
    tipo: string,
    status: string,
    questoes: {
        id: string,
        pergunta: string,
        tipo: string,
        escalaMax?: number,
        opcoes?: string[]
    }[],
    nomeServico: string,
    nomeSetor: string
}