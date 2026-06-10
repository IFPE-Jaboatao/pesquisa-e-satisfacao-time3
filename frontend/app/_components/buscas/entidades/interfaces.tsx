export interface Servico {
    id: number,
    nome: string,
    setor?: {
        id: number,
        nome: string,
        campus?: Campus
    }
    createdAt: string,
    updatedAt: string,
}

export interface Setor {
    id: number,
    nome: string,
    campusId?: number,
    campusNome?: string,
    createdAt?: string,
    updatedAt?: string,
    servicos?: Servico[]
}

export interface Campus {
    id: number,
    nome: string,
    cidade?: string,
    createdAt?: string,
    updatedAt?: string,
    setores?: Setor[],
    cursos?: Curso[]
}

export interface Curso {
    id: number,
    nome: string,
    campusId: number,
    campus: string,
    disciplinas: any[],
    createdAt: string,
    updatedAt: string
}

export interface Disciplina {
    id: number,
    nome: string,
    codigo: string,
    cursoId: number,
    curso: string,
    campusId: number,
    campus: string,
    createdAt: string,
    updatedAt: string
}