'use server'; // Padrão do Next.js para indicar Server Actions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Dispara as respostas recolhidas no formulário direto para o banco de dados via API
 */
export async function enviarRespostasPesquisa(pesquisaId: string, respostas: Record<string, string | number>) {
  try {
    const response = await fetch(`${API_BASE_URL}/respostas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pesquisaId,
        respostas, // Objeto contendo { id_pergunta: resposta }
      }),
    });

    if (!response.ok) {
      return { success: false, message: 'Erro ao processar as respostas na API.' };
    }

    return { success: true, message: 'Suas respostas foram salvas. Obrigado!' };
  } catch (error) {
    console.error("Erro na action ao enviar formulário:", error);
    return { success: false, message: 'Não foi possível conectar ao servidor.' };
  }
}