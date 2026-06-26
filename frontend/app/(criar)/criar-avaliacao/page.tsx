// app/(criar)/criar-avaliacoes/page.tsx
import { redirect } from "next/navigation";
import { getMe } from "@/services/user.service";
import { getCriteriosAvaliacaoDocenteService } from "@/services/avaliacao-docente.service";
import { buscarCursosPorCampusAction } from "@/actions/buscarCursosPorCampus";
import Header from "../../_components/Header";
import { TurmasListagem } from "../../_components/turmas/TurmasListagem";

const ROLES = {
  ADMIN: 'admin',
  GESTOR: 'gestor',
} as const;

export default async function CriarAvaliacoesPage() {
  // 1. Busca dados do usuário primeiro para validar o acesso
  const user = await getMe();

  if (!user) {
    redirect("/login");
  }

  const isAuthorized = user.role === ROLES.GESTOR || user.role === ROLES.ADMIN;
  
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  // 2. Busca dados complementares em paralelo (com tratamento de erro individual)
  const [criterios, cursos] = await Promise.all([
    getCriteriosAvaliacaoDocenteService().catch(() => []),
    buscarCursosPorCampusAction(user.campusId).catch(() => []),
  ]);

  const userRoleDisplay = user.role ? String(user.role).trim().toUpperCase() : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        nome={user.nome || "Usuário"} 
        role={userRoleDisplay} 
        index={0} 
      />
      
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6 text-[#2D3748]">
          Criar Avaliações de Docentes
        </h1>
        
        <TurmasListagem 
            initialCriterios={criterios} 
            initialCursos={cursos} 
        />
      </main>
    </div>
  );
}