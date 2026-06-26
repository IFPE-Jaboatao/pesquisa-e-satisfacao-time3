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
    campusId?: number,
    campus?: string,
    campusNome?:string,
    disciplinas: Disciplina[],
    createdAt: string,
    updatedAt: string
}

export interface Disciplina {
    id: number,
    nome: string,
    codigo: string,
    cursoId?: number,
    curso?: string,
    cursoNome?: string,
    campusId?: number,
    campus?: string,
    campusNome?: string,
    createdAt?: string,
    updatedAt?: string,
    turmas?: Turma[]
}

export interface Turma {
    id: number,
    turno: string,
    periodo?: Periodo,
    docente?: User,
    campus?: Campus,
    disciplina?: Disciplina,
    createdAt: string,
    updatedAt: string,
    matriculas?: Matricula[]
}

export interface Periodo {
    id: number,
    ano: number,
    semestre: number,
    startDate?: string,
    endDate?: string,
    createdAt?: string,
    updatedAt?: string
}

export interface Matricula {
    id: number,
    aluno?: User,
    turma?: Turma,
    createdAt?: string,
    updatedAt?: string
}

export interface User {
    id: number,
    nome: string,
    email?: string,
    matricula?: string,
    role?: string,
    campusId?: number,
    createdAt?: string,
    updatedAt?: string
}