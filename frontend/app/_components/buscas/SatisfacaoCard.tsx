interface Props {
    id: string,
    titulo: string,
    descricao: string,
    dataInicio: string,
    dataFinal: string,
    status: string,
    servicoId: number,
    setorId: number,
    nomeServico: string,
    nomeSetor: string,
    maximoRespostas: number,
    respostasRebecidas: number
}

export default function SatisfacaoCard({
    id,
    titulo,
    descricao,
    dataInicio,
    dataFinal,
    status,
    servicoId,
    setorId,
    nomeServico,
    nomeSetor,
    maximoRespostas,
    respostasRebecidas
}: Props) {
    const dataInicioFormatada = new Date(dataInicio);

    return (
        <div>
            <p>{titulo}</p>
            <p>{descricao}</p>
            <p>{status}</p>
            <p>Setor: {nomeSetor}</p>
            <p>Servico: {nomeServico}</p>
            <p>{respostasRebecidas} / {maximoRespostas} respostas</p>
            <p>Começou em {dataInicioFormatada.toLocaleDateString('pt-br')}</p>
        </div>
    )
}