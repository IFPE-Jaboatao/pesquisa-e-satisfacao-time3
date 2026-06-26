/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPesquisaCompleta } from "@/services/pesquisas.service"; 
import { Card, Progress, Badge, Button } from "flowbite-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PesquisaDetalheProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sucesso?: string }>; // ADICIONADO: Mantém o padrão do Next.js para ler a URL
}

export default async function Pesquisa({ params, searchParams }: PesquisaDetalheProps) {
  const { id } = await params;
  const { sucesso } = await searchParams; // ADICIONADO: Lê se o formulário foi enviado

  const dadosDaPesquisa = (await getPesquisaCompleta({ id })) as any;

  if (dadosDaPesquisa === false) {
    redirect("/login");
  }

  if (!dadosDaPesquisa) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold bg-white rounded-lg shadow m-6">
        Nenhum dado encontrado para a pesquisa {id}.
      </div>
    );
  }

  const pesquisaInfo = dadosDaPesquisa.pesquisa || dadosDaPesquisa;
  const questoes = dadosDaPesquisa.questoes || [];
  const respostasBrutas = dadosDaPesquisa.respostas || [];
  const totalRespostas = dadosDaPesquisa.estatisticas?.totalParticipantes || respostasBrutas.length;

  let excelentes = 0;
  let regulares = 0;
  let ruins = 0;
  const comentariosTexto: string[] = [];

  respostasBrutas.forEach((r: any) => {
    const itens = r.respostas || [];
    itens.forEach((item: any) => {
      const questaoOrigem = questoes.find((q: any) => String(q._id || q.id) === String(item.questaoId));
      
      if (questaoOrigem?.tipo === "ABERTA") {
        if (item.valor && item.valor.trim() !== "") {
          comentariosTexto.push(item.valor);
        }
      } else {
        const valor = parseInt(item.valor);
        if (valor >= 5) excelentes++;      
        else if (valor >= 3) regulares++;   
        else if (valor >= 1) ruins++;       
      }
    });
  });

  const totalVotos = excelentes + regulares + ruins || 1;
  
  const percentualExcelente = Math.round((excelentes / totalVotos) * 100);
  const percentualRegular = Math.round((regulares / totalVotos) * 100);
  const percentualRuim = Math.round((ruins / totalVotos) * 100);
  const mediaAprovacao = Math.round(((excelentes + regulares) / totalVotos) * 100);

  // 📝 SERVER ACTION: Mantida idêntica, mas redirecionando para a mesma rota com a flag de sucesso
  async function lidarComEnvio(formData: FormData) {
    "use server";
    console.log("Respostas enviadas para a pesquisa:", id);
    redirect(`/buscar-pesquisas-satisfacao/${id}?sucesso=true`);
  }

  const ehVisaoAluno = true; 

  if (ehVisaoAluno) {
    return (
      <div className="flex flex-1 flex-col p-6 min-h-screen text-[var(--text-main)]" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-full max-w-3xl mx-auto space-y-6">
          
          {/* MODIFICAÇÃO DO BOTÃO ENVIAR (LAYOUT ADILLA): Esconde o form e exibe a mensagem de sucesso limpa */}
          {sucesso === "true" ? (
            <Card className="text-center p-8 bg-white border border-gray-200 shadow-sm max-w-md mx-auto mt-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 shadow-sm">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900">Resposta enviada!</h2>
                <p className="text-sm text-gray-500 font-medium">
                  Sua pesquisa de satisfação foi registrada com sucesso no sistema.
                </p>
                
                <div className="pt-4 w-full">
                  <Link href="/buscar-pesquisas-satisfacao">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
                      Voltar para as Pesquisas
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            <form action={lidarComEnvio} className="w-full max-w-3xl mx-auto space-y-6">
              <Card style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-green-600 tracking-wide">
                      {pesquisaInfo.tipo || "Questionário Acadêmico"}
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900 mt-1">
                      {pesquisaInfo.titulo || "Formulário de Pesquisa"}
                    </h1>
                  </div>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    Semestre: {pesquisaInfo.periodo || "2026.1"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Por favor, responda às perguntas abaixo com sinceridade.</p>
              </Card>

              {questoes.map((q: any, index: number) => (
                <Card style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} key={q._id || q.id || index}>
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    {index + 1}. {q.pergunta}
                  </label>
                  
                  {q.tipo === "ABERTA" ? (
                    <textarea 
                      name={`questao_${q._id || q.id || index}`}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                      rows={3} 
                      placeholder="Digite sua resposta aqui..."
                    />
                  ) : (
                    <div className="space-y-2">
                      {["Excelente", "Regular", "Ruim"].map((opcao, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`pergunta_${q._id || q.id || index}`} 
                            id={`p_${q._id || q.id || index}_${idx}`} 
                            value={opcao}
                            className="w-4 h-4 text-blue-600" 
                          />
                          <label htmlFor={`p_${q._id || q.id || index}_${idx}`} className="text-sm font-medium text-gray-700 w-full cursor-pointer">
                            {opcao}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}

              <div className="flex justify-end">
                <Button type="submit" size="md" className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">Enviar Respostas</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6 min-h-screen text-[var(--text-main)]" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mb-6 max-w-4xl mx-auto w-full">
        <Link href="/buscar-pesquisas-satisfacao">
          <Button color="gray" size="sm">
            ← Voltar para as Buscas
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total de Respostas</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalRespostas}</h3>
          </Card>
          <Card className="bg-white">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Média Geral de Aprovação</p>
            <h3 className="text-3xl font-bold text-green-600 mt-1">{mediaAprovacao}%</h3>
          </Card>
          <Card className="bg-white">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Período Letivo</p>
            <h3 className="text-xl font-bold text-gray-700 mt-2">{pesquisaInfo.periodo || "2026.1"}</h3>
          </Card>
        </div>

        {excelentes + regulares + ruins > 0 && (
          <Card className="bg-white">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-bold text-gray-800">Distribuição Estatística das Avaliações</h2>
              <p className="text-xs text-gray-500">Dados consolididados do banco de dados em tempo real</p>
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

        {comentariosTexto.length > 0 && (
          <Card className="bg-white">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-bold text-gray-800">Comentários e Feedbacks</h2>
              <p className="text-xs text-gray-500">Respostas discursivas enviadas pelos participantes</p>
            </div>
            <div className="space-y-3 mt-4 max-h-60 overflow-y-auto pr-2">
              {comentariosTexto.map((comentario, index) => (
                <div key={index} className="p-3 bg-gray-50 border-l-4 border-blue-500 rounded text-sm text-gray-700 font-medium shadow-sm">
                  &quot;{comentario}&quot;
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}