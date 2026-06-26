import { getPesquisaCompleta } from "@/services/pesquisaService";
import { Card, Progress, Badge, Button } from "flowbite-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PesquisaDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Pesquisa({ params }: PesquisaDetalheProps) {
  // Espera pegar o id no parâmetro da URL (Deixado pela Ádila)
  const { id } = await params;

  // Busca os dados da pesquisa e força o tipo 'any' para evitar erros de tipagem do TypeScript
  const dadosDaPesquisa = (await getPesquisaCompleta({ id })) as any;

  // Se o token estiver inválido/expirado (Retorno 401), envia para o login
  if (dadosDaPesquisa === false) {
    redirect("/login");
  }

  // Se não encontrar dados, exibe um aviso amigável
  if (!dadosDaPesquisa) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold bg-white rounded-lg shadow m-6">
        Nenhum dado encontrado para a pesquisa {id}.
      </div>
    );
  }

  // =========================================================================
  // ⚙️ TRATAMENTO E ADAPTAÇÃO DOS DADOS DO BACKEND (TIME 3) - ADICIONADO AQUI
  // =========================================================================
  const pesquisaInfo = dadosDaPesquisa.pesquisa || dadosDaPesquisa;
  const questoes = dadosDaPesquisa.questoes || [];
  const respostasBrutas = dadosDaPesquisa.respostas || [];
  const totalRespostas = dadosDaPesquisa.estatisticas?.totalParticipantes || respostasBrutas.length;

  let excelentes = 0;
  let regulares = 0;
  let ruins = 0;
  let comentariosTexto: string[] = [];

  // Varre as respostas do MongoDB tratando perguntas numéricas e abertas de forma separada
  respostasBrutas.forEach((r: any) => {
    const itens = r.respostas || [];
    itens.forEach((item: any) => {
      // Procura a pergunta de origem para checar o tipo (Deixado pela Ádila / Adaptado)
      const questaoOrigem = questoes.find((q: any) => String(q._id || q.id) === String(item.questaoId));
      
      if (questaoOrigem?.tipo === "ABERTA") {
        if (item.valor && item.valor.trim() !== "") {
          comentariosTexto.push(item.valor);
        }
      } else {
        const valor = parseInt(item.valor);
        if (valor >= 5) excelentes++;      // Notas 5 e 6
        else if (valor >= 3) regulares++;   // Notas 3 e 4
        else if (valor >= 1) ruins++;       // Notas 1 e 2
      }
    });
  });

  // CORREÇÃO: Ajustado de 'regulars' para 'regulares' para bater com a variável declarada acima
  const totalVotos = excelentes + regulares + ruins || 1;
  
  // Cria variáveis locais compatíveis com a sua estrutura atual
  const percentualExcelente = Math.round((excelentes / totalVotos) * 100);
  const percentualRegular = Math.round((regulares / totalVotos) * 100);
  const percentualRuim = Math.round((ruins / totalVotos) * 100);
  const mediaAprovacao = Math.round(((excelentes + regulares) / totalVotos) * 100);
  // =========================================================================

  // CORREÇÃO: Modificado temporariamente para true para permitir a visualização do formulário do Aluno
  const ehVisaoAluno = true; 

  if (ehVisaoAluno) {
    // =========================================================================
    // TELA DO ALUNO: Formulário com perguntas editáveis para responder
    // Ajustado para usar var(--white) e var(--dark-color)
    // =========================================================================
    return (
      <div className="flex flex-1 flex-col p-6 min-h-screen text-[var(--dark-color)]" style={{ backgroundColor: 'var(--white)' }}>
        <div className="w-full max-w-3xl mx-auto space-y-6">
          <Card className="bg-white">
            <span className="text-xs font-bold uppercase text-green-600 tracking-wide">Questionário Acadêmico</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{pesquisaInfo.titulo || "Formulário de Pesquisa"}</h1>
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
  // Ajustado para usar var(--white) e var(--dark-color)
  // =========================================================================
  return (
    <div className="flex flex-1 flex-col p-6 min-h-screen text-[var(--dark-color)]" style={{ backgroundColor: 'var(--white)' }}>
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
              {pesquisaInfo.tipo || "Relatório de Satisfação do Gestor"}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              {pesquisaInfo.titulo || "Análise Detalhada da Pesquisa"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              ID da Pesquisa: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{id}</code>
            </p>
          </div>
          <Badge color={pesquisaInfo.status === "ATIVA" ? "success" : "warning"} size="lg" className="font-semibold">
            Status: {pesquisaInfo.status || "Ativa"}
          </Badge>
        </div>

        {/* Indicadores Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total de Respostas</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {totalRespostas}
            </h3>
          </Card>
          <Card className="bg-white">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Média Geral de Aprovação</p>
            <h3 className="text-3xl font-bold text-green-600 mt-1">
              {mediaAprovacao}%
            </h3>
          </Card>
          <Card className="bg-white">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Período Letivo</p>
            <h3 className="text-xl font-bold text-gray-700 mt-2">
              {pesquisaInfo.periodo || "2026.1"}
            </h3>
          </Card>
        </div>

        {/* Distribuição de Gráficos (Flowbite Progress) - Só aparece se houver votos em escala */}
        {excelentes + regulares + ruins > 0 && (
          <Card className="bg-white">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-bold text-gray-800">Distribuição Estatística das Avaliações</h2>
              <p className="text-xs text-gray-500">Dados consolidados do banco de dados em tempo real</p>
            </div>
            
            <div className="space-y-5 mt-4">
              <div>
                <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700">
                  <span>Excelente / Muito Satisfeito</span>
                  <span className="text-green-600">{percentualExcelente}%</span>
                </div>
                <Progress progress={percentualExcelente} color="green" size="lg" />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700">
                  <span>Regular / Atendeu às Expectativas</span>
                  <span className="text-yellow-500">{percentualRegular}%</span>
                </div>
                <Progress progress={percentualRegular} color="yellow" size="lg" />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700">
                  <span>Ruim / Insatisfeito</span>
                  <span className="text-red-600">{percentualRuim}%</span>
                </div>
                <Progress progress={percentualRuim} color="red" size="lg" />
              </div>
            </div>
          </Card>
        )}

        {/* Feedbacks e Respostas Discursivas - Só aparece se houver respostas textuais */}
        {comentariosTexto.length > 0 && (
          <Card className="bg-white">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-bold text-gray-800">Comentários e Feedbacks</h2>
              <p className="text-xs text-gray-500">Respostas discursivas enviadas pelos participantes</p>
            </div>
            <div className="space-y-3 mt-4 max-h-60 overflow-y-auto pr-2">
              {comentariosTexto.map((comentario, index) => (
                <div key={index} className="p-3 bg-gray-50 border-l-4 border-blue-500 rounded text-sm text-gray-700 font-medium shadow-sm">
                  "{comentario}"
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}