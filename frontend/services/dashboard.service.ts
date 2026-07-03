import { UserRole } from "@/app/types/UserRole.enum";
import { apiFetch } from "@/lib/api";

export async function getDashboard(role: UserRole) {

  try {
  const response = await apiFetch(`/users/dashboard/${role}`);

    if (response.status === 404) {
      console.error('Usuário com perfil não reconhecido pelo frontend.')
      return { error: 'Perfil não reconhecido pelo sistema. Tente novamente mais tarde.'}
    }

    return response.json();
  } catch (e) {
    console.error('Erro ao buscar dados de dashboard no frontend. Detalhes:', e)
    return { error: 'Erro de conexão. Tente novamente mais tarde.' }
  }
  
}