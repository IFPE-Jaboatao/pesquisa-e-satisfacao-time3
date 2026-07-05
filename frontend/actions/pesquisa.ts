"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch, apiPost } from "@/lib/api";

// Interface para garantir a tipagem correta dos dados enviados pelo formulário
interface CriarPesquisaInput {
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFinal: string;
  servicoId: number;
  questoes: any[];
}

export async function criarPesquisaSatisfacaoAction(data: CriarPesquisaInput) {
  // Ajustado para enviar a string de data pura, resolvendo o conflito de fuso horário com o .replace() do backend
  const payload = {
    titulo: data.titulo,
    descricao: data.descricao,
    dataInicio: data.dataInicio,
    dataFinal: data.dataFinal,
    servicoId: Number(data.servicoId),
    questoes: data.questoes,
  };

  try {
    // Usando o apiFetch padrão do seu projeto (ele já injeta a URL base e o token de sessão)
    const response = await apiFetch("/surveys/pesquisas/satisfacao", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Se o backend retornar 401 (Não autorizado)
    if (response.status === 401) {
      return { error: "Sessão expirada. Por favor, faça login novamente." };
    }

    // Mantém o seu tratamento exato para o erro 409 (Conflito de período/serviço)
    if (response.status === 409) {
      return { error: "Já existe uma pesquisa ativa para este serviço no período informado." };
    }

    // Tratamento genérico para qualquer outro erro de validação retornando a mensagem do backend
    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Erro ao criar a pesquisa de satisfação." };
    }

  } catch (error) {
    console.error("Erro na Server Action (criarPesquisaSatisfacaoAction):", error);
    return { error: "Erro de conexão com o servidor." };
  }

  // Limpa o cache da rota de listagem para que os dados novos apareçam na tela imediatamente
  revalidatePath("/buscar-pesquisas-satisfacao");

  // Mantém o seu redirecionamento pós-sucesso exatamente para a mesma rota anterior
  redirect("/buscar-pesquisas-satisfacao");
}

interface ActionState {
    error: string,
    message: string,
    success: boolean
}

export async function submitResponse(pesquisaId: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const agrupadas = new Map<string, string[]>();

  // serve para agrupar respostas que tenham o mesmo nome, como as de multipla escolha
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("$ACTION_")) continue;

    if (!agrupadas.has(key)) {
      agrupadas.set(key, []);
    }

    agrupadas.get(key)!.push(String(value));
  }

  const respostas = Array.from(agrupadas.entries()).map(
    ([questaoId, valores]) => ({
      questaoId,
      valor: valores.join(', '), //
    })
  );

  const res = await apiPost(`/surveys/respostas/enviar`, { pesquisaId, respostas });

  if (!res.ok) {
      const text = await res.json();
      
      return { error: text.message, success: false, message: ''};
  }

  return { message: res.statusText, error: '', success: true}

}