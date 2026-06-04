"use client";
import { useState } from "react";
import BuscaTitulo from "./BuscaTitulo";
import SatisfacaoCard from "./SatisfacaoCard";

interface Props {
  data: any;
}

export function SatisfacaoGestor({ data }: Props) {
    const [search, setSearch] = useState('');

    const todasPesquisas = [...data.satisfacoes.ativas, ...data.satisfacoes.inativas, ...data.satisfacoes.fechadas];

    console.log('todas as pesquisas são:', todasPesquisas.length)
    console.log(todasPesquisas[0])

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-row rounded gap-2 p-2" style={{backgroundColor: 'var(--white)'}}>
            <div>
            <BuscaTitulo title="Pesquisa de Satisfações" />

            <input value={search} onChange={(e) => setSearch(e.target.value)}  />
            
            </div>
            <div>
                <p>filtros</p>
            </div>
            </div>
            
            <div>
                <SatisfacaoCard
                id={todasPesquisas[0].id}
                titulo={todasPesquisas[0].titulo}
                descricao={todasPesquisas[0].descricao}
                dataFinal={todasPesquisas[0].dataFinal}
                dataInicio={todasPesquisas[0].dataInicio}
                maximoRespostas={todasPesquisas[0].maximoRespostas}
                respostasRebecidas={todasPesquisas[0].respostasRecebidas}
                nomeServico={todasPesquisas[0].nomeServico}
                nomeSetor={todasPesquisas[0].nomeSetor}
                servicoId={todasPesquisas[0].tipoId}
                setorId={todasPesquisas[0].setorId}
                status={todasPesquisas[0].status}
                /> 
            </div>

        </div>
    )
}
