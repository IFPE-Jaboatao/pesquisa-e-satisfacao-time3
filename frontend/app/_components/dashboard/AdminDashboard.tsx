import { Campus, Curso, Disciplina, Matricula, Periodo, Servico, Setor, Turma, User } from "../buscas/entidades/interfaces";
import CardsDashboard from "./CardsDashboard";
import TopTitleButtons from "./TopTitleButtons";

interface Props {
  data?: DashboardAdmin;
}

export interface DashboardAdmin {
  users: User[],
  institutional: {
    campi: Campus[],
    setores: Setor[],
    servicos: Servico[]
  },
  academic: {
    cursos: Curso[],
    disciplinas: Disciplina[],
    turmas: Turma[],
    matriculas: Matricula[],
    periodos: Periodo[]
  },
  resumo: {
    users: {
      admins: number,
      docentes: number,
      gestores: number,
      alunos: number
    },
    institutional: {
      campi: number,
      setores: number,
      servicos: number
    },
    academic: {
      cursos: number,
      disciplinas: number,
      turmas: number,
      matriculas: number,
      periodos: number
    }
  }
}

export function AdminDashboard({ data }: Props) {

  return (
    <div className="flex-1 p-1">
  
      <TopTitleButtons
        title="Usuários"
        title_backgroundcolor="var(--color-secondary)"
        button1_title="Ver Lista"
        button1_route="/buscar-usuarios"
        button2_title="Criar Usuário"
        button2_route="/criar-usuarios"
      />

      <div className="self-center flex-1">
        <CardsDashboard items={[
          {value: data?.resumo.users.admins || 0, label: 'Admins'},
          {value: data?.resumo.users.gestores || 0, label: 'Gestores'},
          {value: data?.resumo.users.docentes || 0, label: 'Docentes'},
          {value: data?.resumo.users.alunos || 0, label: 'Alunos'}
        ]} />

        </div>

      <TopTitleButtons
        title="Institucional e Acadêmico"
        title_backgroundcolor="var(--color-alt-secondary)"
        button1_title="Ver Lista"
        button1_route="/buscar-entidades"
        button2_title="Criar Entidade"
        button2_route="/criar-entidades"
      />

      <div className="self-center flex-1">
        <CardsDashboard items={[
          {value: data?.resumo.institutional.campi || 0, label: 'Campi'},
          {value: data?.resumo.institutional.setores || 0, label: 'Setores'},
          {value: data?.resumo.institutional.servicos || 0, label: 'Serviços'},
          {value: data?.resumo.academic.periodos || 0, label: 'Períodos'},
          {value: data?.resumo.academic.cursos || 0, label: 'Cursos'},
          {value: data?.resumo.academic.disciplinas || 0, label: 'Disciplinas'},
          {value: data?.resumo.academic.turmas || 0, label: 'Turmas'},
          {value: data?.resumo.academic.matriculas || 0, label: 'Matrículas'}
        ]} />

        </div>

    </div>
  );
}