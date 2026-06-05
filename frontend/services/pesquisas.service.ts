import { apiFetch } from "@/lib/api";

interface Props {
    id: string;
}

export async function getPesquisaCompleta({id}: Props) {
    const res = await apiFetch(`/surveys/pesquisas/${id}/complete`);

    if (res.status === 401) {
        return false
    }

    if (!res.ok) {
        throw new Error(`Falha ao carregar pesquisa: ${res.status}`);
    }

    const pesquisa = await res.json();

    return pesquisa;
}