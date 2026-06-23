"use client";
import { useState } from "react";
import BuscaTitulo from "../BuscaTitulo";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/16/solid";
import { Button } from "flowbite-react";
import { CampiCard, Campus, Servico, ServicoCard, Setor, SetorCard } from "./InstitutionalCards";
import { CursoCard, DisciplinaCard, Matricula, MatriculaCard, Periodo, PeriodoCard, Turma, TurmaCard } from "./AcademicCards";
import { Curso, Disciplina } from "./interfaces";

export type ItemBusca = {
  nome?: string;
  ano?: string | number;
  id?: string | number;
  aluno?: {
    matricula?: string | number;
  };
};

interface Dashboard {
    institutional: {
        campus: Campus[],
        setores: Setor[],
        servicos: Servico[]
    },
    academic: {
        cursos: Curso[],
        disciplinas: Disciplina[],
        turmas: Turma[],
        periodos: Periodo[],
        matriculas: Matricula[]
    }
}

interface Props {
  data: Dashboard;
}

export default function EntidadesAdmin({ data }: Props) {
    const [search, setSearch] = useState('');
    const [entidadeSearch, setEntidadeSearch] = useState('Campi');

    // estilos dos botoes
    const btnEstiloBasico = `flex-1 max-sm:pb-2 max-sm:pt-2 cursor-pointer`;
    const btnTextHighlighted  = 'var(--dark-color)';
    const btnTextNormal = 'var(--white)';
    const btnBackgroundHighlithed = 'var(--highlight)';
    const btnBackgroundNormal = 'var(--grayish-color)';

    // 1. pega a lista inteira baseada na seleção (entidadeSearch) atual
    const getListaPorEntidade = () => {
        switch (entidadeSearch) {
            case 'Campi': return data.institutional.campus;
            case 'Setores': return data.institutional.setores;
            case 'Serviços': return data.institutional.servicos;
            case 'Cursos': return data.academic.cursos;
            case 'Disciplinas': return data.academic.disciplinas;
            case 'Períodos': return data.academic.periodos;
            case 'Turmas': return data.academic.turmas;
            case 'Matrículas': return data.academic.matriculas;
            default: return [];
        }
    };

    // 2. filtra os dados dinamicamente com base no input de pesquisa do usuário (search)
    const listaAtual = getListaPorEntidade();
    const dadosFiltrados = listaAtual.filter((item: ItemBusca) => {
        if (!search) return true; // se não tem busca, mostra tudo
 
        // dependendo da entidade selecionada a busca pode ser feita com base em campos diferentes
        // abaixo tem placeholderHint para deixar claro qual campo de pesquisa está sendo utilizado
        const propriedadeBusca = item?.nome || item?.ano || item?.aluno?.matricula || item?.id || "";
        return propriedadeBusca.toString().toLowerCase().includes(search.toLowerCase());
    });

    // 3. renderiza o card correto baseado na entidade selecionada usando os dados filtrados
    const renderCards = () => {
        if (dadosFiltrados.length === 0) {
            return <p className="col-span-3 text-center py-4">Nenhum resultado encontrado...</p>;
        }

        return dadosFiltrados.map((u) => {
            switch (entidadeSearch) {
                case 'Campi': return <CampiCard key={u.id} campus={u as Campus} />;
                case 'Setores': return <SetorCard key={u.id} setor={u as Setor} />;
                case 'Serviços': return <ServicoCard key={u.id} servico={u as Servico} />;
                case 'Cursos': return <CursoCard key={u.id} curso={u as Curso} />;
                case 'Disciplinas': return <DisciplinaCard key={u.id} disciplina={u as Disciplina} />;
                case 'Períodos': return <PeriodoCard key={u.id} periodo={u as Periodo} />;
                case 'Turmas': return <TurmaCard key={u.id} turma={u as Turma} />;
                case 'Matrículas': return <MatriculaCard key={u.id} matricula={u as Matricula} />;
                default: return <div key="error">Entidade não reconhecida.</div>;
            }
        });
    };

    const placeholderHint = () => {
        switch (entidadeSearch) {
            case 'Campi': return 'Pesquise por nome';
            case 'Setores': return 'Pesquise por nome';
            case 'Serviços': return 'Pesquise por nome';
            case 'Cursos': return 'Pesquise por nome';
            case 'Disciplinas': return 'Pesquise por nome';
            case 'Períodos': return 'Pesquise por ano';
            case 'Turmas': return 'Pesquise por número';
            case 'Matrículas': return 'Pesquise por nome do aluno';
            default: return 'Digite para pesquisar';
        }
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-col p-2 pl-4 pb-4 rounded m-1" style={{backgroundColor: 'var(--white)'}}>
            <div className="flex flex-row max-md:flex-col justify-between gap-2">
                <div className="flex flex-col flex-1 gap-4 items-baseline lg:flex-1 lg:pr-30">
                    <BuscaTitulo title={`Visualizando ${entidadeSearch}`} />

                    <div className="flex max-sm:flex-1 flex-row gap-2 items-center">
                        <input
                        placeholder={placeholderHint()}
                        className="border rounded p-0.5 max-sm:max-w-53 w-53"
                        style={{color: 'var(--dark-color)', borderColor: 'var(--grayish-color)'}}
                        value={search} onChange={(e) => setSearch(e.target.value)}  />
                        
                        <MagnifyingGlassCircleIcon className="h-8 max-sm:hidden" style={{color: `var(--grayish-color)`}} />
                    </div>
                </div>

            <div className="flex flex-col flex-2">
                <p className="font-semibold" style={{color: 'var(--grayish-color)'}}>Entidades</p>
                <div className="flex flex-1 flex-row-reverse
                gap-2 max-md:items-start max-sm:items-stretch max-sm:flex-col-reverse">

                    <div className="flex flex-col flex-1 gap-1">
                        <div className="gap-2 grid grid-cols-4 max-sm:grid-cols-2 max-sm:mb-2">
                            <Button style={{backgroundColor: `${entidadeSearch === `Campi` ? btnBackgroundHighlithed : btnBackgroundNormal}`, color: `${entidadeSearch === `Campi` ? btnTextHighlighted : btnTextNormal}`}} className={btnEstiloBasico} onClick={() => setEntidadeSearch('Campi')}>Campi</Button>
                            <Button style={{backgroundColor: `${entidadeSearch === `Setores` ? btnBackgroundHighlithed : btnBackgroundNormal}`, color: `${entidadeSearch === `Setores` ? btnTextHighlighted : btnTextNormal}`}} className={btnEstiloBasico} onClick={() => setEntidadeSearch('Setores')}>Setores</Button>
                            <Button style={{backgroundColor: `${entidadeSearch === `Serviços` ? btnBackgroundHighlithed : btnBackgroundNormal}`, color: `${entidadeSearch === `Serviços` ? btnTextHighlighted : btnTextNormal}`}} className={btnEstiloBasico} onClick={() => setEntidadeSearch('Serviços')}>Serviços</Button>
                            <Button style={{backgroundColor: `${entidadeSearch === `Períodos` ? btnBackgroundHighlithed : btnBackgroundNormal}`, color: `${entidadeSearch === `Períodos` ? btnTextHighlighted : btnTextNormal}`}} className={btnEstiloBasico} onClick={() => setEntidadeSearch('Períodos')}>Períodos</Button>
                            <Button style={{backgroundColor: `${entidadeSearch === `Cursos` ? btnBackgroundHighlithed : btnBackgroundNormal}`, color: `${entidadeSearch === `Cursos` ? btnTextHighlighted : btnTextNormal}`}} className={btnEstiloBasico} onClick={() => setEntidadeSearch('Cursos')}>Cursos</Button>
                            <Button style={{backgroundColor: `${entidadeSearch === `Disciplinas` ? btnBackgroundHighlithed : btnBackgroundNormal}`, color: `${entidadeSearch === `Disciplinas` ? btnTextHighlighted : btnTextNormal}`}} className={btnEstiloBasico} onClick={() => setEntidadeSearch('Disciplinas')}>Disciplinas</Button>
                            <Button style={{backgroundColor: `${entidadeSearch === `Turmas` ? btnBackgroundHighlithed : btnBackgroundNormal}`, color: `${entidadeSearch === `Turmas` ? btnTextHighlighted : btnTextNormal}`}} className={btnEstiloBasico} onClick={() => setEntidadeSearch('Turmas')}>Turmas</Button>
                            <Button style={{backgroundColor: `${entidadeSearch === `Matrículas` ? btnBackgroundHighlithed : btnBackgroundNormal}`, color: `${entidadeSearch === `Matrículas` ? btnTextHighlighted : btnTextNormal}`}} className={btnEstiloBasico} onClick={() => setEntidadeSearch('Matrículas')}>Matrículas</Button>
                        </div>
                    </div>

                </div>
            </div>

            </div>
        </div>
            
            <div className="max-md:grid max-md:grid-cols-2 max-sm:flex max-sm:flex-col grid grid-cols-3 gap-3 mt-2 mb-2 mr-15 ml-15 max-md:mr-3 max-md:ml-3 max-sm:mr-2 max-sm:ml-2">
                {renderCards()}
            </div>

        </div>
    )
}