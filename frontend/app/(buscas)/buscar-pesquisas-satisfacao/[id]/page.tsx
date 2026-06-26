/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPesquisaCompleta } from "@/services/pesquisas.service"; 
import { Card, Progress, Badge, Button } from "flowbite-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// CORREÇÃO DE CACHE: Força o Next.js a revalidar os dados e buscar direto do banco a cada requisição
export const revalidate = 0;

interface PesquisaDetalheProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sucesso?: string; visao?: string }>; // ADICIONADO: 'visao' para alternar sem mudar o código
}

export default async function Pesquisa({ params, searchParams }: PesquisaDetalheProps) {
  const { id } = await params;
  const { sucesso, visao } = await searchParams; // ADICIONADO: Lê se o usuário quer a visão de gestor

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
        // CORREÇÃO CIRÚRGICA: Lê o valor como texto direto enviado pelo formulário do aluno
        const valorTexto = String(item.valor).trim();
        
        if (valorTexto === "Excelente") excelentes++;      
        else if (valorTexto === "Regular") regulares++;   
        else if (valorTexto === "Ruim") ruins++;       
      }
    }); 
  }); 

  const totalVotos = excelentes + regulares + ruins || 1;
  
  const percentualExcelente = Math.round((excelentes / totalVotos) * 100);
  const percentualRegular = Math.round((regulares / totalVotos) * 100);
  const percentualRuim = Math.round((ruins / totalVotos) * 100);
  const mediaAprovacao = Math.round(((excelentes + regulares) / totalVotos) * 100);

  // SERVER ACTION: Integração com o endpoint de POST usando a rota base REST do back-end
  async function lidarComEnvio(formData: FormData) {
    "use server";
    
    // Mapeia de forma dinâmica os valores inseridos pelo usuário
    const respostasFormatadas = questoes.map((q: any, index: number) => {
      const campoTexto = formData.get(`questao_${q._id || q.id || index}`);
      const campoRadio = formData.get(`pergunta_${q._id || q.id || index}`);
      
      return {
        questaoId: q._id || q.id,
        valor: campoTexto ? String(campoTexto).trim() : String(campoRadio)
      };
    });

    const payload = {
      pesquisaId: id,
      respostas: respostasFormatadas
    };

    try {
      // CORREÇÃO DEFINITIVA DE ROTA: Removido o "/post" do final para casar com o mapeamento nativo POST do NestJS
      const respostaBack = await fetch("http://localhost:3000/surveys/respostas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!respostaBack.ok) {
        throw new Error("Erro ao salvar respostas no banco de dados.");
      }

      console.log("Respostas gravadas com sucesso no MongoDB via Back-end!");
    } catch (erro) {
      console.error("Falha na comunicação com o back-end:", erro);
    }

    redirect(`/buscar-pesquisas-satisfacao/${id}?sucesso=true`);
  }

  // ALTERAÇÃO DINÂMICA: Verifica se a URL tem '?visao=gestor'. Se não tiver, assume VISÃO ALUNO por padrão.
  const ehVisaoAluno = visao !== "gestor"; 

  // ==================== VISÃO DO ALUNO ====================
  if (ehVisaoAluno) {
    return (
      <div className="flex flex-1 flex-col p-6 min-h-screen text-[var(--grayish-color)]" style={{ backgroundColor: 'var(--light-color)' }}>
        <div className="w-full max-w-3xl mx-auto space-y-6">
          
          {sucesso === "true" ? (
            <Card className="text-center p-8 shadow-sm max-w-md mx-auto mt-12" style={{ backgroundColor: 'var(--white)', borderColor: 'var(--light-color)' }}>
              <div className="flex flex-col items-center justify-center space-y-4">
                
                <h2 className="text-2xl font-bold text-gray-900">Resposta enviada!</h2>
                <p className="text-sm text-gray-500 font-medium">
                  Sua pesquisa de satisfação foi registrada com sucesso no sistema.
                </p>
                
                <div className="pt-4 w-full">
                  <Link href="/buscar-pesquisas-satisfacao">
                    <Button className="w-full text-white font-medium rounded-lg animate-none" style={{ backgroundColor: 'var(--edit-blue)' }}>
                      Voltar para as Pesquisas
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            <form action={lidarComEnvio} className="w-full max-w-3xl mx-auto space-y-6">
              <Card style={{ backgroundColor: 'var(--white)', borderColor: 'var(--light-color)' }}>
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--highlight)' }}>
                      {pesquisaInfo.tipo || "Questionário Acadêmico"}
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900 mt-1">
                      {pesquisaInfo.titulo || "Formulário de Pesquisa"}
                    </h1>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--light-color)', color: 'var(--grayish-color)' }}>
                    Semestre: {pesquisaInfo.periodo || "2026.1"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Por favor, responda às perguntas abaixo com sinceridade.</p>
              </Card>

              {questoes.map((q: any, index: number) => (
                <Card style={{ backgroundColor: 'var(--white)', borderColor: 'var(--light-color)' }} key={q._id || q.id || index}>
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    {index + 1}. {q.pergunta}
                  </label>
                  
                  {q.tipo === "ABERTA" ? (
                    <textarea 
                      name={`questao_${q._id || q.id || index}`}
                      className="w-full p-3 border rounded-lg text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500" 
                      style={{ backgroundColor: 'var(--light-color)', borderColor: 'var(--light-color)' }}
                      rows={3} 
                      placeholder="Digite sua resposta aqui..."
                      required
                    />
                  ) : (
                    <div className="space-y-2">
                      {["Excellent", "Regular", "Ruim"].map((opcao, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg hover:opacity-90 cursor-pointer" style={{ borderColor: 'var(--light-color)' }}>
                          <input 
                            type="radio" 
                            name={`pergunta_${q._id || q.id || index}`} 
                            id={`p_${q._id || q.id || index}_${idx}`} 
                            value={opcao}
                            className="w-4 h-4" 
                            style={{ color: 'var(--edit-blue)' }}
                            required
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
                <Button type="submit" size="md" className="text-white font-medium rounded-lg animate-none" style={{ backgroundColor: 'var(--edit-blue)' }}>
                  Enviar Respostas
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ==================== VISÃO DO GESTOR ====================
  return (
    <div className="flex flex-1 flex-col p-6 min-h-screen text-[var(--grayish-color)]" style={{ backgroundColor: 'var(--light-color)' }}>
      <div className="mb-6 max-w-4xl mx-auto w-full">
        <Link href="/buscar-pesquisas-satisfacao">
          <button className="bg-[var(--color-primary)] text-[var(--white)] font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm">
            ← Voltar para as Buscas
          </button>
        </Link>
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-lg shadow-sm border gap-4" style={{ backgroundColor: 'var(--white)', borderColor: 'var(--light-color)' }}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--edit-blue)' }}>
              {pesquisaInfo.tipo || "Relatório de Satisfação do Gestor"}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              {pesquisaInfo.titulo || "Análise Detalhada da Pesquisa"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              ID da Pesquisa: <code className="px-1 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: 'var(--light-color)' }}>{id}</code>
            </p>
          </div>
          <div className="text-right">
            <Badge color={pesquisaInfo.status === "ATIVA" ? "success" : "warning"} size="lg" className="font-semibold mb-2">
              Status: {pesquisaInfo.status || "Ativa"}
            </Badge>
            <p className="text-xs font-semibold text-gray-500">Total de Respostas: {totalRespostas}</p>
          </div>
        </div>

        {/* LÓGICA REFORMULADA (SUGESTÃO ÁDILA): Renderiza e calcula individualmente POR QUESTÃO */}
        {questoes.map((q: any, index: number) => {
          const votosDaQuestao: any[] = [];
          
          respostasBrutas.forEach((r: any) => {
            const itens = r.respostas || [];
            itens.forEach((item: any) => {
              if (String(item.questaoId) === String(q._id || q.id)) {
                if (item.valor && String(item.valor).trim() !== "") {
                  votosDaQuestao.push(item.valor);
                }
              }
            }); 
          }); 

          const ehAberta = q.tipo === "ABERTA";

          return (
            <Card key={q._id || q.id || index} style={{ backgroundColor: 'var(--white)', borderColor: 'var(--light-color)' }}>
              <div className="border-b border-gray-100 pb-3 mb-4">
                <span className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide bg-blue-50 text-blue-600">
                  {ehAberta ? "Pergunta Aberta" : "Escala de Escolha"}
                </span>
                <h3 className="text-base font-bold text-gray-800 mt-2">
                  {index + 1}. {q.pergunta}
                </h3>
              </div>

              {ehAberta ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {votosDaQuestao.filter(v => v && String(v).trim() !== "").length > 0 ? (
                    votosDaQuestao.map((comentario, idx) => (
                      <div key={idx} className="p-3 border-l-4 rounded text-sm text-gray-700 font-medium bg-gray-50 border-blue-500">
                        &quot;{comentario}&quot;
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">Nenhum feedback enviado para esta pergunta.</p>
                  )}
                </div>
              ) : (
                (() => {
                  let exc = 0;
                  let reg = 0;
                  let rui = 0;

                  votosDaQuestao.forEach(v => {
                    const texto = String(v).trim();
                    if (texto === "Excelente" || texto === "Excellent") exc++;
                    else if (texto === "Regular") reg++;
                    else if (texto === "Ruim") rui++;
                  });

                  const totalVotosQuestao = exc + reg + rui || 1;
                  const pExc = Math.round((exc / totalVotosQuestao) * 100);
                  const pReg = Math.round((reg / totalVotosQuestao) * 100);
                  const pRui = Math.round((rui / totalVotosQuestao) * 100);

                  return (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-xs font-semibold text-gray-600">
                          <span>Excelente / Muito Satisfeito ({exc})</span>
                          <span className="text-green-600">{pExc}%</span>
                        </div>
                        <Progress progress={pExc} color="green" size="md" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1 text-xs font-semibold text-gray-600">
                          <span>Regular / Atendeu ({reg})</span>
                          <span className="text-yellow-500">{pReg}%</span>
                        </div>
                        <Progress progress={pReg} color="yellow" size="md" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1 text-xs font-semibold text-gray-600">
                          <span>Ruim / Insatisfeito ({rui})</span>
                          <span className="text-red-600">{pRui}%</span>
                        </div>
                        <Progress progress={pRui} color="red" size="md" />
                      </div>
                    </div>
                  );
                })()
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}