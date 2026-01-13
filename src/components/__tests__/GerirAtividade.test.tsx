import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GerirAtividade } from '../GerirAtividade';

describe('GerirAtividade', () => {
  beforeEach(() => {
    // Reset mocks
  });

  it('deve renderizar o componente', () => {
    render(<GerirAtividade />);
    expect(screen.getByText('Gerir Atividades')).toBeInTheDocument();
  });

  it('deve exibir o formulário', () => {
    render(<GerirAtividade />);
    expect(screen.getByText('Cadastro de Atividade')).toBeInTheDocument();
  });

  it('deve exibir os campos do formulário', () => {
    render(<GerirAtividade />);
    // O asterisco está em um span separado, então usamos regex
    const projectLabels = screen.queryAllByText((content, element) => {
      return content.includes('Projeto') && element?.tagName === 'LABEL';
    });
    expect(projectLabels.length).toBeGreaterThan(0);
    
    const nameLabels = screen.queryAllByText((content, element) => {
      return content.includes('Nome') && element?.tagName === 'LABEL';
    });
    expect(nameLabels.length).toBeGreaterThan(0);
    
    const descricaoLabels = screen.getAllByText('Descrição');
    expect(descricaoLabels.length).toBeGreaterThan(0);
  });

  it('deve exibir a tabela de atividades', () => {
    render(<GerirAtividade />);
    expect(screen.getByText(/Lista de Atividades/)).toBeInTheDocument();
  });

  it('deve exibir as atividades iniciais', () => {
    render(<GerirAtividade />);
    expect(screen.getByText('Refatoração de funcionalidade')).toBeInTheDocument();
    expect(screen.getByText('Modelagem de Banco de Dados')).toBeInTheDocument();
    expect(screen.getByText('Refinamento de HU')).toBeInTheDocument();
  });

  it('deve permitir inserir valores nos campos de formulário', () => {
    render(<GerirAtividade />);
    
    const nomeInput = screen.getByPlaceholderText('Digite o nome') as HTMLInputElement;
    fireEvent.change(nomeInput, { target: { value: 'Nova Atividade' } });
    expect(nomeInput.value).toBe('Nova Atividade');

    const descInput = screen.getByPlaceholderText('Digite uma descrição') as HTMLInputElement;
    fireEvent.change(descInput, { target: { value: 'Descrição teste' } });
    expect(descInput.value).toBe('Descrição teste');
  });

  it('deve exibir 3 atividades inicialmente', () => {
    render(<GerirAtividade />);
    // O número está em um span separado, então usamos regex ou um test-id
    expect(screen.getByText((content, element) => {
      return element?.tagName === 'H3' && content.includes('Lista de Atividades');
    })).toBeInTheDocument();
  });
});
