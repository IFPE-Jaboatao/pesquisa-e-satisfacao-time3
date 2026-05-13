import { createHmac } from 'crypto';

/**
 * gera um hash único e anônimo para um par Aluno/Pesquisa
 * @param studentId
 * @param pesquisaId
 * @returns string (Hash SHA-256)
 */
export const generateAnonymousHash = (studentId: number, pesquisaId: string): string => {
  // tem fallback case a variável de ambiente não esteja configurada
  const secret = process.env.ANONYM_SALT || 'chave-secreta-padrao-faculdade';
  
  return createHmac('sha256', secret)
    .update(`${studentId}-${pesquisaId}`)
    .digest('hex');
};