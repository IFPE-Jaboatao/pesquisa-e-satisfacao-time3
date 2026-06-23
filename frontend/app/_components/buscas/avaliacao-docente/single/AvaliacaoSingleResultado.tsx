import CriteriosDocente from "@/app/_components/dashboard/CriteriosDocente"
import HeaderResultado from "./HeaderResultado"
import KpiDocente from "@/app/_components/dashboard/KpiDocente"
import { BellAlertIcon, ExclamationCircleIcon, FaceSmileIcon, InformationCircleIcon, UserIcon } from "@heroicons/react/16/solid"

interface Props {
    avaliacao: {
        id: string,
        titulo: string,
        descricao: string,
        turmaId: number,
        turno: string,
        curso: string,
        dataInicio: string,
        dataFinal: string,
        respostasRecebidas: number,
        maximoRespostas: number,
        comentarios: string[],
        indicadores: {
            criterio: string,
            totalVotos: number,
            mediaValor: string,
            porcentagem: string
        }[],
        mediaGeral: string,
        pontosAtencao: {
            critico: string[],
            alto: string[],
            razoavel: string[]
        }
    
    }
    
}

export default function AvaliacaoSingleResultado({ avaliacao }: Props) {
    return (
        <div className="flex flex-1 flex-col rounded shadow-2xl">
            <HeaderResultado />
            
            <div className="ml-10 mr-10 mb-10 pb-20 mt-3 max-sm:ml-5 max-sm:mr-5 pl-10 pr-10 pt-5 max-sm:pl-5 max-sm:pr-5 max-sm:pt-3 flex-1 rounded shadow-2xl" style={{backgroundColor: 'var(--white)'}}>
                <p className="font-semibold text-3xl">{avaliacao.titulo}</p>

                <p className="mt-3">{avaliacao.descricao}</p>
                    <div className="flex flex-col">
                        <p><span className="italic">Turma:</span> {avaliacao.turmaId}</p>
                        <p><span className="italic">Turno:</span> {avaliacao.turno}</p>
                        <p><span className="italic">Curso:</span> {avaliacao.curso}</p>
                    </div>

                    <div className="flex flex-row justify-between w-max gap-20 mt-5">
                        <div>
                            <p><span className="">Início:</span> {new Date(avaliacao.dataInicio).toLocaleDateString('pt-br')}</p>
                            <p><span className="">Término:</span> {new Date(avaliacao.dataFinal).toLocaleDateString('pt-br')}</p>  
                        </div>
                        <div>
                            <p><span className="">Respostas:</span> {avaliacao.respostasRecebidas}/{avaliacao.maximoRespostas}</p>
                            <p><span className="">Comentários:</span> {avaliacao.comentarios.length || 0}</p>   
                        </div>
                    </div>

                <hr className="mt-2" style={{color: "var(--grayish-color)"}} />

                <div className="flex flex-col flex-1 mt-3">
                    <p className="text-2xl font-semibold ml-10 mb-3">Critérios Avaliados</p>

                    <div className="flex flex-col flex-1 gap-5">

                        <div className="flex items-start">
                        {avaliacao.respostasRecebidas > 0
                                ? <CriteriosDocente gap={1} items={avaliacao.indicadores} border={true} />
                            : <p>Nenhuma resposta ainda...</p>}
                        </div>
                        
                        <div className="flex flex-1 flex-row max-sm:flex-col">

                            <div className="max-sm:self-center max-sm:mb-2">
                                <KpiDocente value={avaliacao.mediaGeral === 'NaN%' ? 0 : Number(avaliacao.mediaGeral.replace('%', ''))} />
                            </div>
                            
                            <PontosAtencao pontos={avaliacao.pontosAtencao} />
                            
                        </div>

                        <hr />

                        <Comentarios comentarios={avaliacao.comentarios} />
                        
                    </div>
                </div>

            </div>
        </div>
    )
}

interface AtencaoProps {
    pontos: {
        razoavel: string[],
        alto: string[],
        critico: string[]
    }
}

export function PontosAtencao({pontos}: AtencaoProps) {

    function Cards({ list, title, icon, badge, text }: { list: string[], title:string, icon:number, badge: string, text: string }) {
        return (
            <div className="mt-3">
                <div
                style={{backgroundColor: `var(${badge})`}}
                className="flex flex-row gap-2 items-center w-max pl-2 pr-2 pt-0.5 pb-0.5 rounded">
                { icon === 1 ?
                    <InformationCircleIcon className="h-5" style={{color: 'var(--white)'}} />
                    : icon === 2 ? 
                        <BellAlertIcon className="h-5" style={{color: 'var(--white)'}} />
                        : <ExclamationCircleIcon color="green" className="h-5" style={{color: 'var(--dark-color)'}} /> }

                    <p style={{color: `var(${text})`}} className="font-semibold">{title}</p>
                </div>

                <div className="pl-3">
                    {list.map((l) => (
                        <p key={l}>• {l}</p>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 justify-center items-start pl-5">
            <p className="text-xl font-semibold">Pontos de Atenção</p>
            <div className="flex flex-col flex-1 pl-5">

                { pontos.razoavel.length === 0 ?  '' :
                    <Cards list={pontos.razoavel} title="Razoável" icon={1} badge="--yellow-alert" text="--white" />
                }
                
                { pontos.alto.length === 0 ?  '' :
                    <Cards list={pontos.alto} title="Alto" icon={2} badge="--orange-alert" text="--white" />
                }

                { pontos.critico.length === 0 ?  '' :
                    <Cards list={pontos.critico} title="Crítico" icon={3} badge="--error" text="--white" />
                }

                {pontos.razoavel.length === 0 && pontos.alto.length === 0 && pontos.critico.length === 0 ?
                <div className="flex flex-col items-center">
                    <p style={{color: 'var(--grayish-color)'}} className="italic">Nenhum por enquanto!</p>
                    <FaceSmileIcon className="h-8" style={{color: 'var(--color-secondary)'}} />
                    </div>
                : ''}

            </div>
        </div>
    )
}

function Comentarios({ comentarios }: { comentarios: string[] }) {
    
    // card de comentario
    function Card({ text }: { text:string }) {
        return (
            <div className="p-3 rounded-xl flex flex-row gap-2 items-center" style={{backgroundColor: 'var(--light-color)'}}>
                <div className="w-max p-1 rounded-full self-start" style={{backgroundColor: 'var(--grayish-color)'}}>
                    <UserIcon color="white" className="h-7" />
                </div>
                <p>{text}</p>
            </div>
        )
    }

    return (
        <div>
            <p className="font-semibold text-xl">Comentários</p>

            <div className="flex flex-col gap-2">
                {comentarios.length === 0 ? <p className="font-semibold" style={{ color: 'var(--grayish-color)' }}>[0]</p> :
                    comentarios.map((c) => (
                        <Card key={c} text={c} />
                    ))
                }
            </div>
        </div>
    )
}