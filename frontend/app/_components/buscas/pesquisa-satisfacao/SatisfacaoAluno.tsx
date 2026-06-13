"use client";
import { useState } from "react";
import BuscaTitulo from "../BuscaTitulo";
import SatisfacaoCard from "./SatisfacaoCard";
import { LabelGray } from "../../InputLabel";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/16/solid";

interface Props {
  data: any;
}

export function SatisfacaoAluno({ data }: Props) {
    const [search, setSearch] = useState('');
    const [setorSearch, setSetorSearch] = useState('');
    const [servicoSearch, setServicoSearch] = useState('');

    // junta todas as pesquisas
    const todasPesquisas = [...data.satisfacoes];

    const pesquisasFiltradas = todasPesquisas.filter((p) => {
        // 1. filtro por titulo da pesquisa (input de texto)
        const bateTexto = p.titulo.toLowerCase().includes(search.toLowerCase());

        // 2. filtro por setor
        const bateSetor = setorSearch === '' || p.setorId === Number(setorSearch);

        // 3. filtro por serviço
        const bateServico = servicoSearch === '' || p.tipoId === Number(servicoSearch);

        // aplica todos os filtros ao mesmo tempo
        return bateTexto && bateSetor && bateServico;
    });

    // junta os setores presentes nas pesquisas para usar no filtro de Setor
    const setoresMap = Array.from(
        new Map(
            todasPesquisas
            .filter(p => p.setorId)
            .map(p => [p.setorId, { id: p.setorId, nome: p.nomeSetor }])
        ).values()
        );

    // junta os serviços presentes nas pesquisas para usar no filtro de Serviço
    const servicosMap = Array.from(
        new Map(
            todasPesquisas
            .filter(p => p.tipoId)
            .map(p => [p.tipoId, { id: p.tipoId, nome: p.nomeServico, setorId: p.setorId }])
        ).values()
        );

    // filtra os serviços a partir do setor selecionado
    const servicosFiltrados = servicosMap.filter((s) => s.setorId === Number(setorSearch) || '')

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-row max-sm:flex-col rounded justify-between gap-2 p-2 pl-4 pb-4" style={{backgroundColor: 'var(--white)'}}>
                <div className="flex flex-col gap-4 items-baseline lg:flex-1 lg:pr-30">
                    <BuscaTitulo title="Pesquisas de Satisfações" />

                    <div className="flex flex-row gap-2 items-center">
                        <input
                        placeholder="Digite para pesquisar..."
                        className="border rounded p-0.5"
                        style={{color: 'var(--dark-color)', borderColor: 'var(--grayish-color)'}}
                        value={search} onChange={(e) => setSearch(e.target.value)}  />
                        
                        <MagnifyingGlassCircleIcon height={35} style={{color: `var(--grayish-color)`}} />
                    </div>
                </div>

            <div className="flex flex-col">
                <p className="font-semibold" style={{color: 'var(--grayish-color)'}}>Filtros</p>
                <div className="grid-cols-2
                 grid max-md:flex max-md:flex-col gap-2 max-md:items-end max-sm:items-start">
                    <div className="flex flex-row items-center content-center   gap-1">
                        <p className="font-semibold">Setor:</p>
                        <select name="setor" className="border rounded"
                        onChange={(e) => setSetorSearch(e.target.value)}
                        >
                            <option value="">Todos os Setores</option>
                            
                            {setoresMap.map((setor) => (
                                <option  key={setor.id} value={setor.id}>
                                    {setor.nome}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="flex flex-row items-center content-center gap-1">
                        <p className="font-semibold">Serviço:</p>
                        <select name="setor" className="border rounded"
                        onChange={(e) => setServicoSearch(e.target.value)}
                        disabled={setorSearch === ''}
                        >
                        <option value="">{setorSearch === '' ? 'Escolha um setor' : 'Todos os Serviços'}</option>
                        
                        {servicosFiltrados.map((servico) => (
                            <option  key={servico.id} value={servico.id}>
                                {servico.nome}
                            </option>
                        ))}
                        </select>
                    </div>

                </div>
            </div>
        </div>
            
            <div className="flex flex-1 flex-col gap-5 mt-2 mb-2 mr-15 ml-15 max-md:mr-5 max-md:ml-5 max-sm:mr-2 max-sm:ml-2">
                {pesquisasFiltradas?.map((p) => (
                    <SatisfacaoCard
                    aluno={true}
                    avaliacao={false}
                    key={p.id}
                    id={p.id}
                    titulo={p.titulo}
                    descricao={p.descricao}

                    dataFinal={p.dataFinal}
                    dataInicio={p.dataInicio}

                    detalheNome_2={p.nomeServico}
                    detalheNome_1={p.nomeSetor}
                    servicoId={p.tipoId}
                    setorId={p.setorId}
                    status={p.status}
                    /> 
                ))}
            </div>

        </div>
    )
}
