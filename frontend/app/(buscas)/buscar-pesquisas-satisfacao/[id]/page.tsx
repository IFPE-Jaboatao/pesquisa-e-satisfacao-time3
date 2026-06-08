import { getPesquisaCompleta } from "@/services/pesquisas.service";
import { Card, Progress, Badge, Button } from "flowbite-react";
import Link from "next/link";

interface PesquisaDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Pesquisa({ params }: PesquisaDetalheProps) {
  // Espera pegar o id no parâmetro da URL (Deixado pela Ádila)
  const { id } = await params;

  // Busca os dados da pesquisa específica usando o ID (Deixado pela Ádila)
  const dadosDaPesquisa = await getPesquisaCompleta({ id });

  // Se não encontrar dados, exibe um aviso amigável
  if (!dadosDaPesquisa) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold bg-white rounded-lg shadow m-6">
        Nenhum dado encontrado para a pesquisa {id}.
      </div>
    );
  }

  // LÓGICA DE RENDEREZAR: Aqui definimos se exibe a visão do Gestor ou do Aluno
  // Para testar a visão do aluno, você pode mudar para true temporariamente
  const ehVisaoAluno = false; 

  if (ehVisaoAluno) {
    // =========================================================================
    // TELA DO ALUNO: Formulário com perguntas editáveis para responder
    // =========================================================================
    return (
      <div className="flex flex-1 flex-col p-6 min-h-screen" style={{ backgroundColor: 'var(--light-color)' }}>
        <div className="w-full max-w-3xl mx-auto space-y-6">
          <Card className="bg-white">
            <span className="text-xs font-bold uppercase text-green-600 tracking-wide">Questionário Acadêmico</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{dadosDaPesquisa.titulo || "Formulário de Pesquisa"}</h1>
            <p className="text-sm text-gray-500">Por favor, responda às perguntas abaixo com sinceridade.</p>
          </Card>

          {/* Exemplo de Pergunta Editável */}
          <Card className="bg-white">
            <label className="block text-base font-semibold text-gray-800 mb-3">
              1. Como você avalia a didática e o suporte do docente neste período letivo?
            </label>
            <div className="space-y-2">
              {["Excelente", "Regular", "Ruim"].map((opcao, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="radio" name="pergunta_1" id={`p1_${idx}`} className="w-4 h-4 text-blue-600" />
                  <label htmlFor={`p1_${idx}`} className="text-sm font-medium text-gray-700 w-full cursor-pointer">{opcao}</label>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button color="blue" size="md">Enviar Respostas</Button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TELA DO GESTOR: Relatório de satisfação com gráficos e indicadores
  // =========================================================================
  return (
    <div className="flex flex-1 flex-col p-6 min-h-screen" style={{ backgroundColor: 'var(--light-color)' }}>
      {/* Botão para voltar à lista de pesquisas */}
      <div className="mb-6 max-w-4xl mx-auto w-full">
        <Link href="/buscar-pesquisas-satisfacao">
          <Button color="gray" size="sm">
            ← Voltar para as Buscas
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Cabeçalho do Relatório */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-blue-600">
              {dadosDaPesquisa.tipo || "Relatório de Satisfação do Gestor"}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              {dadosDaPesquisa.titulo || "Análise Detalhada da Pesquisa"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              ID da Pesquisa: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{id}</code>
            </p>
          </div>
          <Badge color={dadosDaPesquisa.status === "ATIVA" ? "success" : "warning"} size="lg" className="font-semibold">
            Status: {dadosDaPesquisa.status || "Ativa"}
          </Badge>
        </div>

        {/* Indicadores Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total de Respostas</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {dadosDaPesquisa.totalRespostas || 0}
            </h3>
          </Card>
          <Card className="bg-white">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Média Geral de Aprovação</p>
            <h3 className="text-3xl font-bold text-green-600 mt-1">
              {dadosDaPesquisa.mediaAprovacao ? `${dadosDaPesquisa.mediaAprovacao}%` : "0%"}
            </h3>
          </Card>
          <Card className="bg-white">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Período Letivo</p>
            <h3 className="text-xl font-bold text-gray-700 mt-2">
              {dadosDaPesquisa.periodo || "2026.1"}
            </h3>
          </Card>
        </div>

        {/* Distribuição de Gráficos (Flowbite Progress) */}
        <Card className="bg-white">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-bold text-gray-800">Distribuição Estatística das Avaliações</h2>
            <p className="text-xs text-gray-500">Dados consolidados do banco de dados em tempo real</p>
          </div>
          
          <div className="space-y-5 mt-4">
            <div>
              <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700">
                <span>Excelente / Muito Satisfeito</span>
                <span className="text-green-600">{dadosDaPesquisa.percentualExcelente || 0}%</span>
              </div>
              <Progress progress={dadosDaPesquisa.percentualExcelente || 0} color="green" size="lg" />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700">
                <span>Regular / Atendeu às Expectativas</span>
                <span className="text-yellow-500">{dadosDaPesquisa.percentualRegular || 0}%</span>
              </div>
              <Progress progress={dadosDaPesquisa.percentualRegular || 0} color="yellow" size="lg" />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700">
                <span>Ruim / Insatisfeito</span>
                <span className="text-red-600">{dadosDaPesquisa.percentualRuim || 0}%</span>
              </div>
              <Progress progress={dadosDaPesquisa.percentualRuim || 0} color="red" size="lg" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}