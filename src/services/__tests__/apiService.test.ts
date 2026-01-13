import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  criarAtividade,
  listarAtividades,
  atualizarAtividade,
  excluirAtividade,
  listarProjetos,
  type Atividade,
  type AtividadeResponse,
  type Projeto,
} from '../apiService';

// Mock global fetch
global.fetch = vi.fn();

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('criarAtividade', () => {
    it('deve criar uma atividade com sucesso', async () => {
      const novaAtividade: Atividade = {
        nome: 'Teste Atividade',
        descricao: 'Descrição teste',
        ativo: true,
        id_projeto: 'proj-123',
      };

      const atividadeResponse: AtividadeResponse = {
        ...novaAtividade,
        id: 'ativ-123',
        criado_por: 'usuario@example.com',
        criado_em: '2026-01-10T00:00:00Z',
        atualizado_em: '2026-01-10T00:00:00Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => atividadeResponse,
      });

      const result = await criarAtividade(novaAtividade);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/atividades'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(novaAtividade),
        })
      );
      expect(result).toEqual(atividadeResponse);
    });

    it('deve lançar erro quando a requisição falhar', async () => {
      const novaAtividade: Atividade = {
        nome: 'Teste',
        descricao: 'Teste',
        ativo: true,
        id_projeto: 'proj-123',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Erro específico' }),
      });

      await expect(criarAtividade(novaAtividade)).rejects.toThrow('Erro específico');
    });
  });

  describe('listarAtividades', () => {
    it('deve retornar lista de atividades', async () => {
      const atividades: AtividadeResponse[] = [
        {
          id: 'ativ-1',
          nome: 'Atividade 1',
          descricao: 'Desc 1',
          ativo: true,
          id_projeto: 'proj-1',
          criado_por: 'usuario@example.com',
          criado_em: '2026-01-10T00:00:00Z',
          atualizado_em: '2026-01-10T00:00:00Z',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: atividades }),
      });

      const result = await listarAtividades();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/atividades'),
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(atividades);
    });

    it('deve retornar array vazio quando não houver items', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await listarAtividades();

      expect(result).toEqual([]);
    });
  });

  describe('atualizarAtividade', () => {
    it('deve atualizar uma atividade com sucesso', async () => {
      const atividadeId = 'ativ-123';
      const atividadeAtualizada: Atividade = {
        nome: 'Atividade Atualizada',
        descricao: 'Descrição atualizada',
        ativo: false,
        id_projeto: 'proj-123',
      };

      const response: AtividadeResponse = {
        ...atividadeAtualizada,
        id: atividadeId,
        criado_por: 'usuario@example.com',
        criado_em: '2026-01-10T00:00:00Z',
        atualizado_em: '2026-01-13T12:00:00Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      });

      const result = await atualizarAtividade(atividadeId, atividadeAtualizada);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/v1/atividades/${atividadeId}`),
        expect.objectContaining({
          method: 'PUT',
        })
      );
      expect(result).toEqual(response);
    });
  });

  describe('excluirAtividade', () => {
    it('deve excluir uma atividade com sucesso', async () => {
      const atividadeId = 'ativ-123';

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await excluirAtividade(atividadeId);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/v1/atividades/${atividadeId}`),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('deve lançar erro quando a exclusão falhar', async () => {
      const atividadeId = 'ativ-123';

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Atividade não encontrada' }),
      });

      await expect(excluirAtividade(atividadeId)).rejects.toThrow('Atividade não encontrada');
    });
  });

  describe('listarProjetos', () => {
    it('deve retornar lista de projetos', async () => {
      const projetos: Projeto[] = [
        {
          id: 'proj-1',
          nome: 'Projeto 1',
          descricao: 'Desc 1',
          estado: 'ativo',
          external_id: 'ext-1',
          url: 'http://example.com',
          last_sync_at: '2026-01-10T00:00:00Z',
          created_at: '2026-01-10T00:00:00Z',
          updated_at: '2026-01-10T00:00:00Z',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => projetos,
      });

      const result = await listarProjetos();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/projetos'),
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(projetos);
    });
  });
});
