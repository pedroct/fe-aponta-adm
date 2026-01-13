/**
 * Serviço de comunicação com a API Backend
 */

// URL da API - usando value padrão para produção
// Em desenvolvimento, use .env para sobrescrever
const API_BASE_URL = typeof process !== 'undefined' && process.env?.API_BASE_URL 
  ? process.env.API_BASE_URL 
  : 'https://api-aponta.pedroct.com.br';

// Token de autenticação (opcional) - pode ser configurado via variável de ambiente
// Se não fornecido, as requisições serão feitas sem autenticação
const API_TOKEN_ENV = typeof process !== 'undefined' && process.env?.API_TOKEN 
  ? process.env.API_TOKEN 
  : '';

// Armazenar token obtido do Azure DevOps SDK
let azureDevOpsToken: string | null = null;

export function setAzureDevOpsToken(token: string | null) {
  azureDevOpsToken = token;
}

export interface Atividade {
  nome: string;
  descricao: string;
  ativo: boolean;
  id_projeto: string;
}

export interface AtividadeResponse extends Atividade {
  id: string;
  criado_por: string | null;
  criado_em: string;
  atualizado_em: string;
  nome_projeto?: string;
}

export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  estado: string;
  external_id: string;
  url: string;
  last_sync_at: string;
  created_at: string;
  updated_at: string;
}

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  try {
    // Preparar headers com autenticação
    const headers = {
      ...init?.headers,
    };
    
    // Usar token do Azure DevOps se disponível, caso contrário, usar token de env
    const token = azureDevOpsToken || API_TOKEN_ENV;
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      ...init,
      headers,
    };
    
    const res = await fetch(input, config);

    if (!res.ok) {
      let errBody: any = null;
      try {
        errBody = await res.json();
      } catch (_) {
        // ignore parse errors
      }
      const detail = errBody && (errBody.detail || errBody.message) ? (errBody.detail || errBody.message) : `${res.status} ${res.statusText}`;
      throw new Error(detail);
    }

    return (await res.json()) as T;
  } catch (err: any) {
    // Normalize network / fetch errors so UI shows a helpful message
    const message = err && err.message ? err.message : String(err);
    
    // Verificar se é erro de CORS
    if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
      throw new Error(`Erro de conectividade. Verifique se a API está acessível e se CORS está configurado corretamente para a origem desta extensão. URL: ${API_BASE_URL}`);
    }
    
    throw new Error(`Não foi possível conectar à API (${API_BASE_URL}): ${message}`);
  }
}

/**
 * Cria uma nova atividade na API
 */
export async function criarAtividade(atividade: Atividade): Promise<AtividadeResponse> {
  return request<AtividadeResponse>(`${API_BASE_URL}/api/v1/atividades`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(atividade),
  });
}

/**
 * Lista todas as atividades
 */
export async function listarAtividades(): Promise<AtividadeResponse[]> {
  const data = await request<any>(`${API_BASE_URL}/api/v1/atividades`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Garantir que sempre retorna um array
  if (Array.isArray(data)) {
    return data;
  }
  
  if (data && Array.isArray(data.items)) {
    return data.items;
  }
  
  return [];
}

/**
 * Atualiza uma atividade
 */
export async function atualizarAtividade(atividadeId: string, atividade: Atividade): Promise<AtividadeResponse> {
  return request<AtividadeResponse>(`${API_BASE_URL}/api/v1/atividades/${atividadeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(atividade),
  });
}

/**
 * Exclui uma atividade
 */
export async function excluirAtividade(atividadeId: string): Promise<void> {
  await request<void>(`${API_BASE_URL}/api/v1/atividades/${atividadeId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Lista todos os projetos
 */
export async function listarProjetos(): Promise<Projeto[]> {
  return request<Projeto[]>(`${API_BASE_URL}/api/v1/projetos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
