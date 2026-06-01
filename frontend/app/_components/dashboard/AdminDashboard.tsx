interface Props {
  data: any;
}

export function AdminDashboard({ data }: Props) {

  return (
    <div className="grid gap-4">
        <p>admin card</p>
        <p>{data.resumo.users.total} usuários</p>
        <p>:)</p>
    </div>
  );
}