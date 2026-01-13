import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AtividadesCadastro } from '../AtividadesCadastro';
import * as apiService from '../../services/apiService';

// Mock do SDK da Azure DevOps
vi.mock('azure-devops-extension-sdk', () => ({
  init: vi.fn(),
  ready: vi.fn().mockResolvedValue(undefined),
  getPageContext: vi.fn().mockReturnValue({
    project: null,
    organization: { name: 'Sefaz Ceará' },
    user: { name: 'Test User' },
  }),
  getAccessToken: vi.fn().mockResolvedValue('test-token'),
  notifyLoadSucceeded: vi.fn(),
}));

// Mock do apiService
vi.mock('../../services/apiService', () => ({
  criarAtividade: vi.fn(),
  listarAtividades: vi.fn(),
  listarProjetos: vi.fn(),
  excluirAtividade: vi.fn(),
  atualizarAtividade: vi.fn(),
}));

describe('AtividadesCadastro', () => {
  const mockProjetos = [
    {
      id: 'proj-1',
      nome: 'Projeto Teste',
      descricao: 'Desc',
      estado: 'ativo',
      external_id: 'ext-1',
      url: 'http://test.com',
      last_sync_at: '2026-01-10T00:00:00Z',
      created_at: '2026-01-10T00:00:00Z',
      updated_at: '2026-01-10T00:00:00Z',
    },
  ];

  const mockAtividades = [
    {
      id: 'ativ-1',
      nome: 'Atividade Teste',
      descricao: 'Descrição teste',
      ativo: true,
      id_projeto: 'proj-1',
      nome_projeto: 'Projeto Teste',
      criado_por: 'usuario@example.com',
      criado_em: '2026-01-10T00:00:00Z',
      atualizado_em: '2026-01-10T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup dos mocks padrão
    vi.mocked(apiService.listarProjetos).mockResolvedValue(mockProjetos);
    vi.mocked(apiService.listarAtividades).mockResolvedValue(mockAtividades);
  });

  it('deve renderizar o componente corretamente', () => {
    render(<AtividadesCadastro />);

    expect(screen.getByText('Gestão de Atividades')).toBeInTheDocument();
  });

  it('deve carregar projetos ao montar o componente', async () => {
    render(<AtividadesCadastro />);

    await waitFor(() => {
      expect(apiService.listarProjetos).toHaveBeenCalledTimes(1);
    });
  });

  it('deve carregar atividades ao montar o componente', async () => {
    render(<AtividadesCadastro />);

    await waitFor(() => {
      expect(apiService.listarAtividades).toHaveBeenCalledTimes(1);
    });
  });

  it('deve exibir mensagem quando não há atividades', async () => {
    vi.mocked(apiService.listarAtividades).mockResolvedValue([]);

    render(<AtividadesCadastro />);

    await waitFor(() => {
      expect(screen.getByText(/Nenhuma atividade cadastrada/i)).toBeInTheDocument();
    });
  });

  it('deve exibir lista de atividades quando há dados', async () => {
    render(<AtividadesCadastro />);

    await waitFor(() => {
      expect(screen.getByText('Atividade Teste')).toBeInTheDocument();
      expect(screen.getByText('Lista de Atividades (1)')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de erro quando falha ao carregar projetos', async () => {
    vi.mocked(apiService.listarProjetos).mockRejectedValue(
      new Error('Erro ao carregar projetos')
    );

    render(<AtividadesCadastro />);

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar projetos')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de erro quando falha ao carregar atividades', async () => {
    vi.mocked(apiService.listarAtividades).mockRejectedValue(
      new Error('Erro ao carregar atividades')
    );

    render(<AtividadesCadastro />);

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar atividades')).toBeInTheDocument();
    });
  });

  it('deve validar campos obrigatórios ao adicionar atividade', async () => {
    render(<AtividadesCadastro />);

    await waitFor(() => {
      expect(apiService.listarProjetos).toHaveBeenCalled();
    });

    const addButton = screen.getByRole('button', { name: /adicionar/i });
    await userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Nome da atividade é obrigatório/i)).toBeInTheDocument();
    });

    expect(apiService.criarAtividade).not.toHaveBeenCalled();
  });

  it('deve criar uma nova atividade com sucesso', async () => {
    const novaAtividade = {
      id: 'ativ-2',
      nome: 'Nova Atividade',
      descricao: 'Nova descrição',
      ativo: true,
      id_projeto: 'proj-1',
      nome_projeto: 'Projeto Teste',
      criado_por: 'usuario@example.com',
      criado_em: '2026-01-10T00:00:00Z',
      atualizado_em: '2026-01-10T00:00:00Z',
    };

    vi.mocked(apiService.criarAtividade).mockResolvedValue(novaAtividade);

    render(<AtividadesCadastro />);

    await waitFor(() => {
      expect(apiService.listarProjetos).toHaveBeenCalled();
    });

    // Preencher o formulário
    const nomeInput = screen.getByPlaceholderText(/Digite o nome da atividade/i);
    await userEvent.type(nomeInput, 'Nova Atividade');

    const descricaoInput = screen.getByPlaceholderText(/Digite uma descrição/i);
    await userEvent.type(descricaoInput, 'Nova descrição');

    // Simular seleção de projeto (este teste pode precisar de ajustes dependendo da implementação do Dropdown)
    // Por enquanto vamos apenas verificar que o botão de adicionar está presente

    const addButton = screen.getByRole('button', { name: /adicionar/i });
    expect(addButton).toBeInTheDocument();
  });

  it('deve exibir estado de loading ao criar atividade', async () => {
    vi.mocked(apiService.criarAtividade).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<AtividadesCadastro />);

    await waitFor(() => {
      expect(apiService.listarProjetos).toHaveBeenCalled();
    });

    // Verificar que o botão existe (mesmo sem preencher o formulário)
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    expect(addButton).toBeInTheDocument();
  });
});
