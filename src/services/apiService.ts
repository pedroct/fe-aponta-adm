/**
 * Serviço de comunicação com a API Backend
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
const AZURE_DEVOPS_PAT = process.env.AZURE_DEVOPS_PAT || '';

export interface Atividade {
  nome: string;
  descricao: string;
  ativo: boolean;
  id_projeto: string;
}

export interface AtividadeResponse extends Atividade {
  id: string;
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

/**
 * Cria uma nova atividade na API
 */
export async function criarAtividade(atividade: Atividade): Promise<AtividadeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/atividades`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AZURE_DEVOPS_PAT}`,
    },
    body: JSON.stringify(atividade),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Erro ao criar atividade');
  }

  return response.json();
}

/**
 * Lista todas as atividades
 */
export async function listarAtividades(): Promise<AtividadeResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/atividades`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AZURE_DEVOPS_PAT}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Erro ao listar atividades');
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Atualiza uma atividade
 */
export async function atualizarAtividade(atividadeId: string, atividade: Atividade): Promise<AtividadeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/atividades/${atividadeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AZURE_DEVOPS_PAT}`,
    },
    body: JSON.stringify(atividade),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Erro ao atualizar atividade');
  }

  return response.json();
}

/**
 * Exclui uma atividade
 */
export async function excluirAtividade(atividadeId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/atividades/${atividadeId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AZURE_DEVOPS_PAT}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Erro ao excluir atividade');
  }
}

/**
 * Lista todos os projetos
 */
export async function listarProjetos(): Promise<Projeto[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/projetos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AZURE_DEVOPS_PAT}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Erro ao listar projetos');
  }

  return response.json();
}
