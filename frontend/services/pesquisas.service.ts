import { apiFetch } from "@/lib/api";

// Mantém a interface original para garantir compatibilidade com as páginas que chamam passando objeto
interface Props {
    id: string;
}

export async function getPesquisaCompleta({ id }: Props) {
    const res = await apiFetch(`/surveys/pesquisas/${id}/complete`);

    if (res.status === 401) {
        return false;
    }

    if (!res.ok) {
        throw new Error(`Falha ao carregar pesquisa: ${res.status}`);
    }

    const pesquisa = await res.json();
    return pesquisa;
}

export async function getServicosPorCampus(): Promise<any[]> {
    const res = await apiFetch("/institutional/servicos");

    if (res.status === 401) {
        return []; // Retornar um array vazio evita que o .map() quebre na tela se falhar
    }

    if (!res.ok) {
        throw new Error(`Falha ao carregar serviços: ${res.status}`);
    }

    const servicos = await res.json();
    return servicos || [];
}

export async function getSetoresComServicosPorCampus(campusId: number): Promise<any[]> {
    const res = await apiFetch(`/institutional/setores?campusId=${campusId}`);

    if (res.status === 401) {
        return [];
    }

    if (!res.ok) {
        throw new Error(`Falha ao carregar setores do campus: ${res.status}`);
    }

    const setores = await res.json();
    return setores || [];
}