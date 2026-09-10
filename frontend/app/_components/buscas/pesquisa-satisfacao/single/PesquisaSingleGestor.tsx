import { findUsersByCampus } from "@/services/user.service";
import { RelatorioPesquisaGestor } from "../../avaliacao-docente/interface"
import HeaderResultado from "../../avaliacao-docente/single/HeaderResultado"
import { SimpleTable } from "@/app/_components/charts/CustomTable";
import BarChart from "@/app/_components/charts/BarChart";
import PieChart from "@/app/_components/charts/PieChart";


interface Props {
    relatorio: RelatorioPesquisaGestor
}

export default async function PesquisaSingleGestor({ relatorio }: Props) {
    const quantidadeRespondentes = await findUsersByCampus(relatorio.pesquisa.campusId);

    const todasRespostas = relatorio.respostas.flatMap((r) => r.respostas);

    const RespostasAberta = ({ pergunta }: { pergunta: { id: string, pergunta: string}}) => {
        const respostas = todasRespostas.filter((r) => r.questaoId == pergunta.id);

        return (
            <div className="flex flex-1 flex-col max-h-50">
                <p className="italic" style={{ color: 'var(--grayish-color)'}}>Questão</p>
                <p>{pergunta.pergunta}</p>
                <SimpleTable data={respostas.map((r) => r.valor)} />
            </div>
        )
    }

    const RespostasEscala = ({ pergunta }: { pergunta: { id: string, pergunta: string, escalaMax?: number}}) => {
        const respostas = todasRespostas.filter((r) => r.questaoId == pergunta.id);

        return (
            <div className="flex flex-1 flex-col gap-2 max-h-60">
                <div>
                <p className="italic" style={{ color: 'var(--grayish-color)'}}>Questão</p>
                <p>{pergunta.pergunta}</p>
                </div>
                <BarChart dados={respostas.map((r) => r.valor)} escalaMax={pergunta.escalaMax || 5} />
            </div>
        )
    }

    const RespostasMultipla = ({ pergunta }: { pergunta: { id: string, pergunta: string, opcoes?: string[]}}) => {
        const respostas = todasRespostas.filter((r) => r.questaoId == pergunta.id);

        return (
            <div className="flex flex-1 flex-col max-h-90">
                <div>
                <p className="italic" style={{ color: 'var(--grayish-color)'}}>Questão</p>
                <p>{pergunta.pergunta}</p>
                </div>
                <PieChart dados={respostas.map((r) => r.valor)} opcoes={pergunta.opcoes || []} />
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 pb-10">
            <HeaderResultado pesquisa />
            <div className="pt-5 flex justify-center">
                <div className="bg-white self-center rounded p-5 w-4xl shadow-2xl pb-30">
                    <p className="italic" style={{ color: 'var(--grayish-color)'}}>Respostas</p>
                    <p className="font-bold text-3xl pb-2" style={{ color: 'var(--color-primary)' }}>{relatorio?.pesquisa.titulo}</p>
                    <hr className="opacity-50" style={{ color: 'var(--color-primary'}} />
                    <p>{relatorio.pesquisa.descricao}</p>
                    <p>Data início: {relatorio.pesquisa.dataInicio}</p>
                    <p>Data final: {relatorio.pesquisa.dataFinal}</p>
                    <p>Quantidade de questões: {relatorio.estatisticas.totalQuestoes}</p>
                    <p>Respostas: {relatorio.estatisticas.totalParticipantes} / {quantidadeRespondentes}</p>


                    <div className="pt-10 pb-10 flex flex-col flex-1 gap-15"> 
                        {relatorio.pesquisa.questoes.map((q) => (
                            q.tipo == 'ABERTA' ? <RespostasAberta key={q.id} pergunta={q} />
                            : q.tipo == 'ESCALA' ? <RespostasEscala key={q.id} pergunta={q} />
                            : q.tipo == 'MULTIPLA' ? <RespostasMultipla key={q.id} pergunta={q} />
                            : <p key={q.id}>Questão não reconhecida</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}