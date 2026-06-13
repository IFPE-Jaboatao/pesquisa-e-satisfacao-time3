"use client";
import { useState } from "react";
import BuscaTitulo from "../BuscaTitulo";
import SatisfacaoCard from "../pesquisa-satisfacao/SatisfacaoCard";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/16/solid";

interface Props {
  data: any;
}

export default function AvaliacaoDocente({ data }: Props) {
    const [search, setSearch] = useState('');
    const [cursoSearch, setCursoSearch] = useState('');
    const [disciplinaSearch, setDisciplinaSearch] = useState('');
    const [periodoSearch, setPeriodoSearch] = useState('');
    const [turnoSearch, setTurnoSearch] = useState('');
    const [statusSearch, setStatusSearch] = useState('');

    // lista para filtro de Status
    const tiposStatus = [{'nome': 'ativa', 'nomeFormatado': 'Ativa'},
        {'nome': 'inativa', 'nomeFormatado': 'Inativa'},
        {'nome': 'fechada', 'nomeFormatado': 'Fechada'}
    ]

    // junta todas as pesquisas
    const todasPesquisas = [...data.ativas, ...data.inativas, ...data.fechadas];

    const pesquisasFiltradas = todasPesquisas.filter((p) => {
        // 1. filtro por titulo da pesquisa (input de texto)
        const bateTexto = p.titulo.toLowerCase().includes(search.toLowerCase());

        // 2. filtro por curso
        const bateCurso = cursoSearch === '' || p.cursoId === Number(cursoSearch);

        // 3. filtro por disciplina
        const bateDisciplina = disciplinaSearch === '' || p.disciplinaId === Number(disciplinaSearch);

        // 4. filtro por periodo
        const batePeriodo = periodoSearch === '' || p.periodoId === Number(periodoSearch);

        // 5. filtro por serviço
        const bateTurno = turnoSearch === '' || p.turno === turnoSearch;

        // 6. filtro por status
        const bateStatus = statusSearch === '' || p.status === statusSearch;

        // aplica todos os filtros ao mesmo tempo
        return bateTexto && bateCurso && bateDisciplina && batePeriodo && bateTurno && bateStatus;
    });

    // junta os periodos presentes nas pesquisas para usar no filtro de Periodo
    const periodosMap = Array.from(
        new Map(
            todasPesquisas
            .filter(p => p.periodoId)
            .map(p => [p.periodoId, { id: p.periodoId, periodo: p.periodo }])
        ).values()
        );

    // junta os cursos presentes nas pesquisas para usar no filtro de Curso
    const cursosMap = Array.from(
        new Map(
            todasPesquisas
            .filter(p => p.cursoId)
            .map(p => [p.cursoId, { id: p.cursoId, nome: p.curso }])
        ).values()
        );

    // junta as disciplinas presentes nas pesquisas para usar no filtro de Disciplina
    const disciplinasMap = Array.from(
        new Map(
            todasPesquisas
            .filter(p => p.disciplinaId)
            .map(p => [p.disciplinaId, { id: p.disciplinaId, nome: p.disciplina, cursoId: p.cursoId }])
        ).values()
        );

    // filtra as disciplinas a partir do curso selecionado
    const disciplinasFiltradas = disciplinasMap.filter((s) => s.cursoId === Number(cursoSearch) || '');

    // junta as docentes presentes nas pesquisas para usar no filtro de Docente
    const docentesMap = Array.from(
        new Map(
            todasPesquisas
            .filter(p => p.docenteId)
            .map(p => [p.docenteId, { id: p.docenteId, nome: p.docente }])
        ).values()
        );

    // junta os turnos presentes nas pesquisas para usar no filtro de Turno
    const turnosMap = Array.from(
        new Map(
            todasPesquisas
            .filter(p => p.turno)
            .map(p => [p.turno, { turno: p.turno }])
        ).values()
        );

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-row max-sm:flex-col rounded justify-between gap-2 p-2 pl-4 pb-4" style={{backgroundColor: 'var(--white)'}}>
                <div className="flex flex-col gap-4 items-baseline lg:flex-1 lg:pr-30">
                    <BuscaTitulo title="Avaliações Docente" />

                    <div className="flex flex-row gap-2 items-center">
                        <input
                        placeholder="Digite para pesquisar..."
                        className="border rounded p-0.5"
                        style={{color: 'var(--dark-color)', borderColor: 'var(--grayish-color)'}}
                        value={search} onChange={(e) => setSearch(e.target.value)}  />
                        
                        <MagnifyingGlassCircleIcon height={35} style={{color: `var(--grayish-color)`}} />
                    </div>
                </div>

            <div className="flex flex-col items-start">
                <p className="font-semibold" style={{color: 'var(--grayish-color)'}}>Filtros</p>
                <div className="
                flex flex-col gap-2 max-md:items-end max-sm:items-start">

                    <div className="flex flex-row items-center justify-start gap-1">
                        <p className="font-semibold">Curso:</p>
                        <select name="curso" className="border rounded lg:max-w-max max-sm:max-w-40 max-sm:text-sm"
                        onChange={(e) => setCursoSearch(e.target.value)}
                        >
                            <option value="">Todos os Cursos</option>
                            
                            {cursosMap.map((curso) => (
                                <option key={curso.id} value={curso.id}>
                                    {curso.nome}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="grid-cols-2 grid max-md:flex max-md:flex-col max-md:flex-1 self-start gap-2">
                    <div className="flex flex-row gap-1">
                        <p className="font-semibold">Disciplina:</p>
                        <select name="disciplina" className="border rounded"
                        onChange={(e) => setDisciplinaSearch(e.target.value)}
                        disabled={cursoSearch === ''}
                        >
                        <option value="">{cursoSearch === '' ? 'Escolha um curso' : 'Todos as Disciplinas'}</option>
                        
                        {disciplinasFiltradas.map((disciplina) => (
                            <option  key={disciplina.id} value={disciplina.id}>
                                {disciplina.nome}
                            </option>
                        ))}
                        </select>
                    </div>

                    <div className="flex flex-row gap-1">
                        <p className="font-semibold">Período:</p>
                        <select name="periodo" className="border rounded"
                        onChange={(e) => setPeriodoSearch(e.target.value)}
                        >
                            <option value="">Todos os Períodos</option>
                            
                            {periodosMap.map((periodo) => (
                                <option  key={periodo.id} value={periodo.id}>
                                    {periodo.periodo}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="flex flex-row gap-1">
                        <p className="font-semibold">Turno:</p>
                        <select name="turno" className="border rounded"
                        onChange={(e) => setTurnoSearch(e.target.value)}
                        >
                        <option value="">Todos</option>
                        
                        {turnosMap.map((t) => (
                            <option  key={t.turno} value={t.turno}>
                                {t.turno}
                            </option>
                        ))}
                    </select>

                    </div>

                    <div className="flex flex-row justify-start content-center gap-1">
                        <p className="font-semibold">Status:</p>
                        <select name="status" className="border rounded"
                        onChange={(e) => setStatusSearch(e.target.value)}
                        >
                        <option value="">Todos</option>
                        
                        {tiposStatus.map((status) => (
                            <option  key={status.nome} value={status.nome}>
                                {status.nomeFormatado}
                            </option>
                        ))}
                    </select>

                    </div>
                    </div>

                </div>
            </div>
        </div>
            
            <div className="flex flex-1 flex-col gap-5 mt-2 mb-2 mr-15 ml-15 max-md:mr-5 max-md:ml-5 max-sm:mr-2 max-sm:ml-2">
                {pesquisasFiltradas?.map((p) => (
                    <SatisfacaoCard
                    aluno={false}
                    avaliacao={true}
                    key={p.id}
                    id={p.id}
                    titulo={p.titulo}
                    descricao={p.descricao}

                    dataFinal={p.dataFinal}
                    dataInicio={p.dataInicio}

                    maximoRespostas={p.maximoRespostas}
                    respostasRebecidas={p.respostasRecebidas}

                    detalheNome_2={p.turno}
                    detalheNome_1={p.tipoId}

                    status={p.status}
                    /> 
                ))}
            </div>

        </div>
    )
}
