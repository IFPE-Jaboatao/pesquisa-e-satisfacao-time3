import { findUsersByCampus } from "@/services/user.service";
import { RelatorioPesquisaGestor } from "../../avaliacao-docente/interface"
import HeaderResultado from "../../avaliacao-docente/single/HeaderResultado"

interface Props {
    relatorio: RelatorioPesquisaGestor
}

export default async function PesquisaSingleGestor({ relatorio }: Props) {
    const quantidadeRespondentes = await findUsersByCampus(relatorio.pesquisa.campusId);

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


                    <p>{relatorio?.pesquisa?.questoes[0]?.pergunta}</p>
                    <p>{relatorio?.respostas[0]?.respostas[0]?.valor}</p>
                </div>
            </div>
        </div>
    )
}