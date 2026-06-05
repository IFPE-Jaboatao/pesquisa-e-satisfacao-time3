import BasicButton from "../BasicButton";

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
    const dataInicioFormatada = new Date(dataInicio).toLocaleDateString('pt-br');
    const dataFinalFormatada = new Date(dataFinal).toLocaleDateString('pt-br');

    let inicioVerbo;
    let finalVerbo;
    let ribbonMaior;
    let ribbonMenor;
    if (status === 'ativa') {
        inicioVerbo = 'Iniciada em';
        finalVerbo = 'Finaliza em';
        ribbonMaior = `--color-secondary`;
        ribbonMenor = `--color-primary`;
    }
    else if (status === 'inativa') {
        inicioVerbo = 'Inicia em';
        finalVerbo = 'Finaliza em';
        ribbonMaior = `--grayish-color`;
        ribbonMenor = `--dark-color`;
    }
    else if (status === 'fechada') {
        inicioVerbo = 'Iniciada em';
        finalVerbo = 'Finalizada em';
        ribbonMaior = `--color-alt-secondary`;
        ribbonMenor = `--color-alt-primary`;
    } else {
        inicioVerbo = 'Data início:'
        finalVerbo = 'Data final:'
        ribbonMaior = `--error`;
        ribbonMenor = `--dark-color`;
    }

    return (
        <div>
            <div
            style={{ clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)", backgroundColor: `var(${ribbonMaior})`}}
            className="w-7 h-7 ml-2 absolute">
                </div>
                <div
            style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)", backgroundColor: `var(${ribbonMenor})`}}
            className="w-2 h-2 ml-1 absolute">
                </div>
        <div className="p-2 pl-6 mt-2 rounded flex flex-row max-md:flex-col justify-between" style={{backgroundColor: 'var(--white)'}}>
            <div className="max-md:grid max-md:grid-cols-2 flex flex-row flex-1 justify-between mr-4 lg:mr-40">
            <div className="flex flex-col">
                <p className="font-semibold text-xl">{titulo}</p>
                <p>{descricao}</p>
                <div className="mt-1 flex flex-row max-md:justify-around justify-between max-sm:flex-col">
                    <p className="italic">Setor: {nomeSetor}</p>
                    <p className="italic">Serviço: {nomeServico}</p>
                </div>
            </div>

            <div className="border-l-2 max-md:border-0 pl-3 flex justify-center items-center flex-col" style={{borderColor: 'var(--light-color)'}}>
                <p><span className="text-4xl">{respostasRebecidas}</span>/{maximoRespostas}</p>
                <p>respostas</p>
            </div>
            </div>
            
            <div className="flex flex-col max-md:flex-row max-md:justify-between max-md:content-center max-md:mr-8 mr-2">
                <div className="flex flex-col justify-center max-sm:text-sm">
                <p>{inicioVerbo} {dataInicioFormatada}</p>
                <p>{finalVerbo} {dataFinalFormatada}</p>
                </div>
                <BasicButton route={`/buscar-pesquisas-satisfacao/${id}`} title="Ver Pesquisa" />
            </div>
            
        </div>
        </div>
    )
}