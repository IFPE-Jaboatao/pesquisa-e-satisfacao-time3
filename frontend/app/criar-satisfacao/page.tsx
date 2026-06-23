import { redirect } from "next/navigation";
import Header from "@/app/_components/Header";
import CriarPesquisa from "@/app/_components/forms/CriarPesquisa";
import { getMe } from "@/lib/session";
// ADAPTAÇÃO: Importada a função 'getServicosPorCampus' para buscar os serviços órfãos
import { getSetoresComServicosPorCampus, getServicosPorCampus } from "@/services/pesquisas.service";

interface ServicoCampus {
  id: number;
  nome: string;
  setorId?:number,
  setor?: {
    id: number
  }
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

  // RBAC: Alunos possuem apenas permissão de resposta, sendo restritos da criação de pesquisas
  if (user.role === "aluno") {
    redirect("/unauthorized");
  }

  let setores: SetorCampus[] = [];
  try {
    // Filtra a busca inicial pelo campus associado ao gestor para vincular setores e serviços dependentes
    if (user.campusId) {
      // CORREÇÃO/ADAPTAÇÃO: Dispara as duas consultas em paralelo para máxima performance no servidor
      const [dadosSetores, dadosServicos] = await Promise.all([
        getSetoresComServicosPorCampus(user.campusId),
        getServicosPorCampus()
      ]);

      // Garante a atribuição apenas se 'dadosSetores' for uma estrutura válida de array
      if (dadosSetores && Array.isArray(dadosSetores)) {
        // Cruza os dados mapeando cada serviço para dentro do seu respectivo setor pai
        setores = dadosSetores.map((setor: SetorCampus) => {
          // Filtra os serviços que pertencem a este setor específico (checa chave estrangeira ou objeto)
          const servicosDoSetor = Array.isArray(dadosServicos)
            ? dadosServicos.filter((s: ServicoCampus) => s.setorId === setor.id || s.setor?.id === setor.id)
            : [];

          return {
            id: setor.id,
            nome: setor.nome,
            servicos: servicosDoSetor
          };
        });
      }
    } else {
      console.warn("Aviso: Usuário logado não possui um campusId associado.");
    }
  } catch (error) {
    console.error("Erro ao carregar setores e serviços na página de criação:", error);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header 
        nome={user.nome} 
        role={user.role} 
        index={0} 
      />

      <div className="container mx-auto px-4 py-6">
        {/* Blindagem de renderização: se setores falhar por qualquer motivo, injeta array vazio inline */}
        {setores && Array.isArray(setores) ? (
          <CriarPesquisa setores={setores} />
        ) : (
          <CriarPesquisa setores={[]} />
        )}
      </div>
    </main>
  );
}
