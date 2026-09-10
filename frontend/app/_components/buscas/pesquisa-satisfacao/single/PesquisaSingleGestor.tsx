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
    const dataInicioFormatada = new Date(relatorio.pesquisa.dataInicio); 
    const dataFinalFormatada = new Date(relatorio.pesquisa.dataFinal); 

    const quantidadeRespondentes = await findUsersByCampus(relatorio.pesquisa.campusId);

    const todasRespostas = relatorio.respostas.flatMap((r) => r.respostas);

    const RespostasAberta = ({ pergunta }: { pergunta: { id: string, pergunta: string}}) => {
        const respostas = todasRespostas.filter((r) => r.questaoId == pergunta.id);

        return (
            <div className="flex flex-1 flex-col gap-4 max-h-50">
                <div className="border-b" style={{ borderColor: 'var(--grayish-color)' }}>
                    <p className="italic" style={{ color: 'var(--grayish-color)'}}>Questão</p>
                    <p>{pergunta.pergunta}</p>
                </div>
                <SimpleTable data={respostas.map((r) => r.valor)} />
            </div>
        )
    }

    const RespostasEscala = ({ pergunta }: { pergunta: { id: string, pergunta: string, escalaMax?: number}}) => {
        const respostas = todasRespostas.filter((r) => r.questaoId == pergunta.id);

        return (
            <div className="flex flex-1 flex-col gap-4 max-md:max-h-40 max-h-70">
                <div className="border-b" style={{ borderColor: 'var(--grayish-color)'}}>
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
            <div className="flex flex-1 gap-4 flex-col max-md:max-h-70 max-h-90">
                <div className="border-b" style={{ borderColor: 'var(--grayish-color)'}}>
                <p className="italic" style={{ color: 'var(--grayish-color)'}}>Questão</p>
                <p>{pergunta.pergunta}</p>
                </div>
                <PieChart dados={respostas.map((r) => r.valor)} opcoes={pergunta.opcoes || []} />
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 pb-10 p-2">
            <HeaderResultado pesquisa />
            <div className="pt-5 flex justify-center ">
                <div className="bg-white self-center rounded p-5 shadow-2xl max-sm:max-w-fit lg:w-3xl pb-30 ">
                    <p className="italic" style={{ color: 'var(--grayish-color)'}}>Respostas</p>
                    <p className="font-bold text-3xl pb-2" style={{ color: 'var(--color-primary)' }}>{relatorio?.pesquisa.titulo}</p>
                    <hr className="opacity-50" style={{ color: 'var(--color-primary'}} />
                    <p>Descrição: {relatorio.pesquisa.descricao}</p>
                    <div className="flex justify-between py-4">
                        <p>Data início: {dataInicioFormatada.toLocaleDateString('pt-br')}</p>
                        <p>Data final: {dataFinalFormatada.toLocaleDateString('pt-br')}</p>
                    </div>
                    <div className="flex justify-between py-2">
                        <p>Serviço: {relatorio.pesquisa.servicoNome}</p>
                        <p>Setor: {relatorio.pesquisa.setorNome}</p>
                    </div>
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