import { UserRole } from "@/app/types/UserRole.enum";
import { apiFetch } from "@/lib/api";

export async function getDashboard(role: UserRole) {
  
  const response = await apiFetch(`/users/dashboard/${role}`);

  if (response.status === 404) {
    throw new Error('Perfil não suportado.')
  }

  return response.json();
}