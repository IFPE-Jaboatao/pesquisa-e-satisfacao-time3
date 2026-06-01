interface Props {
  data: any;
}

export function DocenteDashboard({ data }: Props) {
  return (
    <div className="grid gap-4">
        <p>docente card</p>
       <p>Foi avaliado em {data.avaliacoes.totalTurmasAvaliado} turmas</p>
    </div>
  );
}