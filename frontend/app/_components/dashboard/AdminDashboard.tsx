import CardsDashboard from "./CardsDashboard";
import TopTitleButtons from "./TopTitleButtons";

interface Props {
  data: any;
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
          {value: data.resumo.users.admins, label: 'Admins'},
          {value: data.resumo.users.gestores, label: 'Gestores'},
          {value: data.resumo.users.docentes, label: 'Docentes'},
          {value: data.resumo.users.alunos, label: 'Alunos'}
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
          {value: data.resumo.institutional.campi, label: 'Campi'},
          {value: data.resumo.institutional.setores, label: 'Setores'},
          {value: data.resumo.institutional.servicos, label: 'Serviços'},
          {value: data.resumo.academic.periodos, label: 'Períodos'},
          {value: data.resumo.academic.cursos, label: 'Cursos'},
          {value: data.resumo.academic.disciplinas, label: 'Disciplinas'},
          {value: data.resumo.academic.turmas, label: 'Turmas'},
          {value: data.resumo.academic.matriculas, label: 'Matrículas'}
        ]} />

        </div>

    </div>
  );
}