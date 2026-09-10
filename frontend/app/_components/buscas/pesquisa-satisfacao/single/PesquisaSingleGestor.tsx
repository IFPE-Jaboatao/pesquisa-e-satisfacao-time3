import { findUsersByCampus } from "@/services/user.service";
import { RelatorioPesquisaGestor } from "../../avaliacao-docente/interface"
import HeaderResultado from "../../avaliacao-docente/single/HeaderResultado"
import { SimpleTable } from "@/app/_components/charts/CustomTable";


interface Props {
    relatorio: RelatorioPesquisaGestor
}

export default async function PesquisaSingleGestor({ relatorio }: Props) {
    const quantidadeRespondentes = await findUsersByCampus(relatorio.pesquisa.campusId);

    const todasRespostas = relatorio.respostas.flatMap((r) => r.respostas);

    const RespostasAberta= ({ pergunta }: { pergunta: { id: string, pergunta: string}}) => {
        const respostas = todasRespostas.filter((r) => r.questaoId == pergunta.id);

        return (
            <div className="flex flex-1 flex-col max-h-50">
                <p className="italic" style={{ color: 'var(--grayish-color)'}}>Questão</p>
                <p>{pergunta.pergunta}</p>
                <SimpleTable data={respostas.map((r) => r.valor)} />
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1">
            <HeaderResultado pesquisa />
            <div className="pt-5 flex justify-center">
                <div className="bg-white self-center rounded p-3 w-3xl shadow-2xl">
                    <p className="italic" style={{ color: 'var(--grayish-color)'}}>Respostas</p>
                    <p className="font-bold text-3xl pb-2" style={{ color: 'var(--color-primary)' }}>{relatorio?.pesquisa.titulo}</p>
                    <hr className="opacity-50" style={{ color: 'var(--color-primary'}} />
                    <p>Quantidade de questões: {relatorio.estatisticas.totalQuestoes}</p>
                    <p>Respostas: {relatorio.estatisticas.totalParticipantes} / {quantidadeRespondentes}</p>


                    <div className="pt-10 pb-10"> 
                        <RespostasAberta pergunta={relatorio?.pesquisa?.questoes[0]} />

                    </div>
                </div>
            </div>
        </div>
    )
}