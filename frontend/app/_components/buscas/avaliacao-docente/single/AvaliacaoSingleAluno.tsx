interface Props {
    avaliacao?: {
        id: string,
        titulo: string,
        descricao: string
    }
}

export default function AvaliacaoSingleAluno({ avaliacao }: Props) {
    return (
        <div>{avaliacao?.titulo}</div>
    )
}