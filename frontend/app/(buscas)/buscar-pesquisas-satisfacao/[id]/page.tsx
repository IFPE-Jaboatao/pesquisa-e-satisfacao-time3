import { getPesquisaCompleta } from "@/services/pesquisas.service";

interface PesquisaDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Pesquisa({ params }: PesquisaDetalheProps) {
// espera pegar o id no parâmetro da URL
  const { id } = await params;

  // busca os dados da pesquisa específica usando o ID
  const dadosDaPesquisa = await getPesquisaCompleta({id});

  // é bom incluir uma lógica de PesquisaRenderer
  // pra conseguir redirecionar o gestor para a tela da pesquisa do jeito correto (com headers e tal)
  // e colocar o aluno pra tela da pesquisa com as perguntas editaveis pra ele responder e tal

    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <p>Dados retornados em dadosDaPesquisa</p>
            {// pode apagar isso aqui embaixo
            // é só pra mostrar os valores de dadosDaPesquisa  
            }
            <pre className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto max-h-100">
            {JSON.stringify(dadosDaPesquisa, null, 2)}
            </pre>
        </div>
    )
} 