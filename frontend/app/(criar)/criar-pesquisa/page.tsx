import { redirect } from "next/navigation";
import Header from "@/app/_components/Header";
import CriarPesquisa from "@/app/_components/forms/CriarPesquisaForm";
import { getMe } from "@/lib/session";
import { getSetoresComServicosPorCampus, getServicosPorCampus } from "@/services/pesquisas.service";

interface ServicoCampus {
  id: number;
  nome: string;
  setorId?: number;
  setor?: { id: number };
  campusId?: number; // Adicionado para garantir filtro de segurança
}

interface SetorCampus {
  id: number;
  nome: string;
  servicos: ServicoCampus[];
}

export default async function CriarPesquisaPage() {
  const user = await getMe();

  if (!user) {
    redirect("/login");
  }

  // RBAC: Alunos possuem apenas permissão de resposta
  if (user.role === "aluno") {
    redirect("/unauthorized");
  }

  let setores: SetorCampus[] = [];

  try {
    if (user.campusId) {
      // Executa consultas em paralelo
      const [dadosSetores, todosServicos] = await Promise.all([
        getSetoresComServicosPorCampus(user.campusId),
        getServicosPorCampus()
      ]);

      if (Array.isArray(dadosSetores)) {
        // SEGURANÇA: Filtra serviços primeiro pelo campusId do usuário logado
        const servicosDoCampus = Array.isArray(todosServicos)
          ? todosServicos.filter((s) => s.campusId === user.campusId)
          : [];

        // Cruza os dados mapeando cada serviço para dentro do seu respectivo setor
        setores = dadosSetores.map((setor: SetorCampus) => {
          return {
            id: setor.id,
            nome: setor.nome,
            servicos: servicosDoCampus.filter(
              (s) => s.setorId === setor.id || s.setor?.id === setor.id
            )
          };
        });
      }
    } else {
      console.warn("Aviso: Usuário logado não possui um campusId associado.");
    }
  } catch (error) {
    console.error("Erro ao carregar setores e serviços:", error);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header 
        nome={user.nome} 
        role={user.role} 
        index={0} 
      />

      <div className="container mx-auto px-4 py-6">
        <CriarPesquisa setores={setores} />
      </div>
    </main>
  );
}