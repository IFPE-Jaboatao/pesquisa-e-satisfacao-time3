import { RelatorioPesquisaGestor } from "../../avaliacao-docente/interface"

interface Props {
    relatorio: RelatorioPesquisaGestor
}

export default function PesquisaSingleGestor({ relatorio }: Props) {
    return (
        <div>
            <p>Dados para o gestor ver</p>
            <p>{relatorio.pesquisa.questoes[0].pergunta}</p>
            <p>{relatorio.respostas[0].respostas[0].valor}</p>
        </div>
    )
}