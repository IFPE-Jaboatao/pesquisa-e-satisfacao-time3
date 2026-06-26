import { getSessionToken } from './session';

/**
 * Função interna para centralizar a criação de headers e requisições
 */
async function request(path, options = {}) {
    const token = await getSessionToken();
    const headers = new Headers(options.headers || {});
    
    // Sempre definir como JSON
    headers.set('Content-Type', 'application/json');
    
    // Adicionar token se existir
    if (token) {
        headers.set('Authorization', `Bearer ${token.trim()}`);
    }

    const config = {
        ...options,
        headers,
        cache: 'no-store',
        // ATENÇÃO: Se sua API exige apenas Bearer Token, 
        // remova 'credentials: include' para evitar conflitos de segurança.
    };

    const response = await fetch(`${process.env.API_BASE_URL}${path}`, config);
    return response;
}

export const apiFetch = (path, init = {}) => request(path, init);

export const apiPost = (path, data, init = {}) => 
    request(path, { ...init, method: 'POST', body: JSON.stringify(data) });

export const apiPatch = (path, data, init = {}) => 
    request(path, { ...init, method: 'PATCH', body: JSON.stringify(data) });

export const apiDelete = (path, init = {}) => 
    request(path, { ...init, method: 'DELETE' });