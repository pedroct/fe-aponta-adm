import * as React from 'react';
import {
  TextField,
  TextFieldWidth
} from 'azure-devops-ui/TextField';
import {
  Dropdown
} from 'azure-devops-ui/Dropdown';
import {
  DropdownSelection
} from 'azure-devops-ui/Utilities/DropdownSelection';
import {
  IListBoxItem
} from 'azure-devops-ui/ListBox';
import {
  Button
} from 'azure-devops-ui/Button';
import {
  Card
} from 'azure-devops-ui/Card';
import {
  Table,
  ITableColumn,
  SimpleTableCell
} from 'azure-devops-ui/Table';
import {
  ArrayItemProvider
} from 'azure-devops-ui/Utilities/Provider';
import {
  ObservableValue
} from 'azure-devops-ui/Core/Observable';
import {
  Icon,
  IconSize
} from 'azure-devops-ui/Icon';
import {
  MessageCard,
  MessageCardSeverity
} from 'azure-devops-ui/MessageCard';
import {
  Dialog
} from 'azure-devops-ui/Dialog';
import {
  Header,
  TitleSize
} from 'azure-devops-ui/Header';

import 'azure-devops-ui/Core/override.css';
import '../styles/atividades-refactored.css';
import * as SDK from 'azure-devops-extension-sdk';
import { criarAtividade, Atividade, listarProjetos, Projeto, listarAtividades, AtividadeResponse, excluirAtividade, atualizarAtividade } from '../services/apiService';

interface HubContext {
  mode: 'collection' | 'project';
  projectId?: string;
  projectName?: string;
}

interface IAtividade {
  id: string;
  nome: string;
  descricao: string;
  nome_projeto: string;
  ativo: boolean;
  id_projeto: string;
  criado_por: string | null;
}

export class AtividadesCadastro extends React.Component<{}, {
  atividades: IAtividade[];
  nomeAtividade: string;
  descricao: string;
  projetoSelecionado: IListBoxItem | undefined;
  projetos: IListBoxItem[];
  isLoading: boolean;
  isLoadingProjetos: boolean;
  isLoadingAtividades: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  dialogAberto: boolean;
  atividadeParaExcluir: IAtividade | null;
  atividadeEmEdicao: string | null;
  hubMode: 'collection' | 'project';
  projectNameReadOnly: string | null;
  projectIdContext: string | null;
  isLoadingHubContext: boolean;
}> {
  private projetoSelection = new DropdownSelection();
  private _isMounted: boolean = false;
  private rootRef = React.createRef<HTMLDivElement>();

  private safeSetState = (state: Partial<{
    atividades: IAtividade[];
    nomeAtividade: string;
    descricao: string;
    projetoSelecionado: IListBoxItem | undefined;
    projetos: IListBoxItem[];
    isLoading: boolean;
    isLoadingProjetos: boolean;
    isLoadingAtividades: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    dialogAberto: boolean;
    atividadeParaExcluir: IAtividade | null;
    atividadeEmEdicao: string | null;
    hubMode: 'collection' | 'project';
    projectNameReadOnly: string | null;
    projectIdContext: string | null;
    isLoadingHubContext: boolean;
  }>, callback?: () => void) => {
    if (this._isMounted) {
      // Types are wide; delegate to React.setState
      this.setState(state as any, callback);
    }
  };

  constructor(props: {}) {
    super(props);
    this.state = {
      atividades: [],
      nomeAtividade: '',
      descricao: '',
      projetoSelecionado: undefined,
      projetos: [],
      isLoading: false,
      isLoadingProjetos: false,
      isLoadingAtividades: false,
      errorMessage: null,
      successMessage: null,
      dialogAberto: false,
      atividadeParaExcluir: null,
      atividadeEmEdicao: null,
      hubMode: 'collection',
      projectNameReadOnly: null,
      projectIdContext: null,
      isLoadingHubContext: true,
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    console.log('[AtividadesCadastro] Component montado');

    // Inicializar SDK do Azure DevOps
    SDK.init({ loaded: false, applyTheme: true });

    SDK.ready()
      .then(() => {
        console.log('[AtividadesCadastro] SDK pronto');

        // Detectar modo de hub e carregar dados apropriados
        return this.detectHubMode();
      })
      .then(() => {
        console.log('[AtividadesCadastro] Inicialização completa');

        try {
          SDK.notifyLoadSucceeded();
        } catch (e) {
          console.warn('[AtividadesCadastro] notifyLoadSucceeded falhou:', e);
        }
      })
      .catch((error) => {
        console.error('[AtividadesCadastro] Erro durante inicialização:', error);

        this.safeSetState({
          errorMessage: 'Erro ao inicializar extensão. Verifique sua conexão.',
          isLoadingHubContext: false,
        });
      });

    // Observar mudanças na seleção do dropdown
    this.projetoSelection.subscribe(this.onProjetoChange);
  }

  private detectHubMode = async (): Promise<void> => {
    try {
      console.log('[AtividadesCadastro] Detectando hub mode...');

      // Obter contexto da página via SDK
      const pageContext = SDK.getPageContext();

      // Verificar se existe projeto no contexto (project-level hub)
      // Tenta acessar project via pageContext (estrutura pode variar)
      const projectInfo = (pageContext as any)?.project || (pageContext as any)?.webContext?.project;

      if (projectInfo && projectInfo.id) {
        // 🎯 Project Admin Hub
        console.log('[AtividadesCadastro] Detectado: Project Admin Hub');
        console.log('[AtividadesCadastro] Projeto:', projectInfo.name);

        this.safeSetState({
          hubMode: 'project',
          projectNameReadOnly: projectInfo.name,
          projectIdContext: projectInfo.id,
          isLoadingHubContext: false,
        });

        // Carregar apenas atividades deste projeto
        await this.loadAtividadesForProject(projectInfo.id);
      } else {
        // 🎯 Collection Admin Hub
        console.log('[AtividadesCadastro] Detectado: Collection Admin Hub');

        this.safeSetState({
          hubMode: 'collection',
          projectNameReadOnly: null,
          projectIdContext: null,
          isLoadingHubContext: false,
        });

        // Carregar todos os projetos e atividades
        await this.carregarProjetos();
        await this.carregarAtividades();
      }
    } catch (error) {
      console.error('[AtividadesCadastro] Erro ao detectar hub mode:', error);

      this.safeSetState({
        hubMode: 'collection', // Fallback
        isLoadingHubContext: false,
        errorMessage: 'Erro ao inicializar interface. Tente recarregar a página.',
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    // If the component is unmounting while an element inside it still has focus,
    // blur it to avoid accessibility warnings like "aria-hidden on a focused element".
    try {
      const root = this.rootRef.current;
      const active = document && (document.activeElement as HTMLElement | null);
      if (root && active && root.contains(active)) {
        active.blur();
      }
    } catch (e) {
      // ignore DOM access errors in non-browser environments
    }

    this.projetoSelection.unsubscribe(this.onProjetoChange);
  }

  private onProjetoChange = () => {
    const selectedIndexes = this.projetoSelection.value;
    if (selectedIndexes && selectedIndexes.length > 0) {
      const selectedIndex = selectedIndexes[0];
      if (typeof selectedIndex === 'number') {
        this.setState({
          projetoSelecionado: this.state.projetos[selectedIndex]
        });
      }
    }
  };

  private carregarProjetos = async () => {
    this.safeSetState({ isLoadingProjetos: true });

    try {
      const projetosData = await listarProjetos();

      // Converter projetos da API para o formato do dropdown
      const projetosDropdown: IListBoxItem[] = projetosData.map(projeto => ({
        id: projeto.id,
        text: projeto.nome
      }));

      this.safeSetState({
        projetos: projetosDropdown,
        isLoadingProjetos: false
      });
    } catch (error) {
      this.safeSetState({
        isLoadingProjetos: false,
        errorMessage: error instanceof Error ? error.message : 'Erro ao carregar projetos'
      });
    }
  };

  private carregarAtividades = async () => {
    this.safeSetState({ isLoadingAtividades: true });

    try {
      console.log('Carregando atividades da API...');
      const atividadesData = await listarAtividades();
      console.log('Atividades recebidas da API:', atividadesData);
      console.log('Tipo dos dados:', typeof atividadesData, 'É array?', Array.isArray(atividadesData));
      console.log('Projetos disponíveis:', this.state.projetos);

      // Verificar se atividadesData é um array
      if (!Array.isArray(atividadesData)) {
        console.error('API não retornou um array:', atividadesData);
        this.setState({
          atividades: [],
          isLoadingAtividades: false
        });
        return;
      }

      // Converter atividades da API para o formato da tabela
      const atividadesTabela: IAtividade[] = atividadesData.map(atividade => ({
        id: atividade.id,
        nome: atividade.nome,
        descricao: atividade.descricao,
        nome_projeto: atividade.nome_projeto || 'Projeto não encontrado',
        ativo: atividade.ativo,
        id_projeto: atividade.id_projeto,
        criado_por: atividade.criado_por
      }));

      console.log('Atividades processadas:', atividadesTabela);

      this.safeSetState({
        atividades: atividadesTabela,
        isLoadingAtividades: false
      });
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      this.safeSetState({
        isLoadingAtividades: false,
        errorMessage: error instanceof Error ? error.message : 'Erro ao carregar atividades'
      });
    }
  };

  private loadAtividadesForProject = async (projectId: string): Promise<void> => {
    this.safeSetState({ isLoadingAtividades: true, errorMessage: null });

    try {
      console.log('[AtividadesCadastro] Carregando atividades do projeto:', projectId);

      // Carregar todas as atividades
      const allAtividades = await listarAtividades();

      // Filtrar apenas as do projeto atual
      const filteredAtividades = allAtividades.filter(
        (atividade) => atividade.id_projeto === projectId
      );

      console.log('[AtividadesCadastro] Total de atividades:', allAtividades.length);
      console.log('[AtividadesCadastro] Atividades do projeto:', filteredAtividades.length);

      // Converter para o formato da tabela
      const atividadesTabela: IAtividade[] = filteredAtividades.map(atividade => ({
        id: atividade.id,
        nome: atividade.nome,
        descricao: atividade.descricao,
        nome_projeto: atividade.nome_projeto || 'Projeto não encontrado',
        ativo: atividade.ativo,
        id_projeto: atividade.id_projeto,
        criado_por: atividade.criado_por
      }));

      this.safeSetState({
        atividades: atividadesTabela,
        isLoadingAtividades: false,
      });
    } catch (error: any) {
      console.error('[AtividadesCadastro] Erro ao carregar atividades:', error);

      this.safeSetState({
        errorMessage: error.message || 'Erro ao carregar atividades',
        atividades: [],
        isLoadingAtividades: false,
      });
    }
  };

  private onNomeAtividadeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string) => {
    this.setState({ nomeAtividade: value });
  };

  private onDescricaoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string) => {
    this.setState({ descricao: value });
  };

  private adicionarAtividade = async () => {
    const { nomeAtividade, descricao, projetoSelecionado, atividadeEmEdicao, hubMode, projectIdContext } = this.state;

    // Validação: Nome é obrigatório
    if (!nomeAtividade.trim()) {
      this.safeSetState({ errorMessage: 'Nome da atividade é obrigatório' });
      return;
    }

    // Validação: Descrição obrigatória
    if (!descricao.trim()) {
      this.safeSetState({ errorMessage: 'Descrição é obrigatória' });
      return;
    }

    // Determinar ID do projeto baseado no hub mode
    let projectId: string | null = null;

    if (hubMode === 'project') {
      // 🎯 Project Hub: Usar projeto do contexto
      projectId = projectIdContext;
      console.log('[AtividadesCadastro] Project Hub - Usando projeto do contexto:', projectId);
    } else {
      // 🎯 Collection Hub: Usar projeto selecionado no dropdown
      if (!projetoSelecionado) {
        this.safeSetState({ errorMessage: 'Selecione um projeto' });
        return;
      }
      projectId = projetoSelecionado.id as string;
      console.log('[AtividadesCadastro] Collection Hub - Usando projeto do dropdown:', projectId);
    }

    // Validação final
    if (!projectId) {
      this.safeSetState({ errorMessage: 'Erro: projeto não identificado' });
      return;
    }

    // Limpar mensagens anteriores
    this.safeSetState({
      isLoading: true,
      errorMessage: null,
      successMessage: null
    });

    try {
      // Preparar dados da atividade
      const atividadeData: Atividade = {
        nome: nomeAtividade,
        descricao: descricao || '',
        ativo: true,
        id_projeto: projectId
      };

      if (atividadeEmEdicao) {
        // Atualizar atividade existente
        const response = await atualizarAtividade(atividadeEmEdicao, atividadeData);

        // Atualizar na lista local
        const atividadeAtualizada: IAtividade = {
          id: response.id,
          nome: response.nome,
          descricao: response.descricao,
          nome_projeto: response.nome_projeto || (projetoSelecionado?.text || ''),
          ativo: response.ativo,
          id_projeto: response.id_projeto,
          criado_por: response.criado_por
        };

        this.safeSetState({
          atividades: this.state.atividades.map(a =>
            a.id === atividadeEmEdicao ? atividadeAtualizada : a
          ),
          nomeAtividade: '',
          descricao: '',
          projetoSelecionado: undefined,
          isLoading: false,
          atividadeEmEdicao: null,
          successMessage: 'Atividade atualizada com sucesso!'
        });
      } else {
        // Criar nova atividade
        const response = await criarAtividade(atividadeData);

        // Adicionar à lista local
        const novaAtividade: IAtividade = {
          id: response.id,
          nome: response.nome,
          descricao: response.descricao,
          nome_projeto: response.nome_projeto || (projetoSelecionado?.text || ''),
          ativo: response.ativo,
          id_projeto: response.id_projeto,
          criado_por: response.criado_por
        };

        this.safeSetState({
          atividades: [...this.state.atividades, novaAtividade],
          nomeAtividade: '',
          descricao: '',
          projetoSelecionado: undefined,
          isLoading: false,
          successMessage: 'Atividade criada com sucesso!'
        });
      }

      // Limpar seleção do dropdown (apenas em Collection Hub)
      if (hubMode === 'collection') {
        this.projetoSelection.clear();
      }

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        this.safeSetState({ successMessage: null });
      }, 3000);

    } catch (error) {
      this.safeSetState({
        isLoading: false,
        errorMessage: error instanceof Error ? error.message : 'Erro ao ' + (atividadeEmEdicao ? 'atualizar' : 'criar') + ' atividade'
      });
    }
  };

  private abrirDialogExclusao = (id: string) => {
    const atividade = this.state.atividades.find(a => a.id === id);
    if (!atividade) return;

    this.setState({
      dialogAberto: true,
      atividadeParaExcluir: atividade
    });
  };

  private fecharDialog = () => {
    this.setState({
      dialogAberto: false,
      atividadeParaExcluir: null
    });
  };

  private confirmarExclusao = async () => {
    const { atividadeParaExcluir } = this.state;
    if (!atividadeParaExcluir) return;

    // Fechar dialog
    this.fecharDialog();

    // Limpar mensagens anteriores
    this.setState({
      errorMessage: null,
      successMessage: null
    });

    try {
      // Chamar API para excluir
      await excluirAtividade(atividadeParaExcluir.id);

      // Remover da lista local após sucesso
      this.safeSetState({
        atividades: this.state.atividades.filter(a => a.id !== atividadeParaExcluir.id),
        successMessage: 'Atividade removida com sucesso!'
      });

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        this.safeSetState({ successMessage: null });
      }, 3000);

    } catch (error) {
      this.safeSetState({
        errorMessage: error instanceof Error ? error.message : 'Erro ao excluir atividade'
      });
    }
  };

  private removerAtividadeLocal = (id: string) => {
    this.setState({
      atividades: this.state.atividades.filter(a => a.id !== id)
    });
  };

  private editarAtividade = (id: string) => {
    const atividade = this.state.atividades.find(a => a.id === id);
    if (atividade) {
      // Encontrar o projeto no dropdown
      const projetoIndex = this.state.projetos.findIndex(p => p.id === atividade.id_projeto);
      const projetoSelecionado = projetoIndex !== -1 ? this.state.projetos[projetoIndex] : undefined;

      // Preencher o formulário com os dados da atividade
      this.setState({
        nomeAtividade: atividade.nome,
        descricao: atividade.descricao,
        projetoSelecionado: projetoSelecionado,
        atividadeEmEdicao: id,
        errorMessage: null,
        successMessage: null
      });

      // Selecionar o projeto no dropdown
      if (projetoIndex !== -1) {
        this.projetoSelection.select(projetoIndex);
      }
    }
  };

  private cancelarEdicao = () => {
    this.setState({
      nomeAtividade: '',
      descricao: '',
      projetoSelecionado: undefined,
      atividadeEmEdicao: null,
      errorMessage: null,
      successMessage: null
    });
    this.projetoSelection.clear();
  };

  private renderAtividadeCell = (
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<IAtividade>,
    atividade: IAtividade
  ): JSX.Element => {
    return (
      <SimpleTableCell
        columnIndex={columnIndex}
        tableColumn={tableColumn}
        key={`col-${columnIndex}`}
      >
        <div className="flex-row scroll-hidden">
          <span className="text-ellipsis">{atividade.nome}</span>
        </div>
      </SimpleTableCell>
    );
  };

  private renderProjetoCell = (
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<IAtividade>,
    atividade: IAtividade
  ): JSX.Element => {
    return (
      <SimpleTableCell
        columnIndex={columnIndex}
        tableColumn={tableColumn}
        key={`col-${columnIndex}`}
      >
        <div className="flex-row scroll-hidden">
          <span className="text-ellipsis">{atividade.nome_projeto}</span>
        </div>
      </SimpleTableCell>
    );
  };

  private renderDescricaoCell = (
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<IAtividade>,
    atividade: IAtividade
  ): JSX.Element => {
    return (
      <SimpleTableCell
        columnIndex={columnIndex}
        tableColumn={tableColumn}
        key={`col-${columnIndex}`}
      >
        <div className="flex-row scroll-hidden">
          <span className="text-ellipsis">{atividade.descricao}</span>
        </div>
      </SimpleTableCell>
    );
  };

  private renderCriadoPorCell = (
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<IAtividade>,
    atividade: IAtividade
  ): JSX.Element => {
    return (
      <SimpleTableCell
        columnIndex={columnIndex}
        tableColumn={tableColumn}
        key={`col-${columnIndex}`}
      >
        <div className="flex-row scroll-hidden">
          <span className="text-ellipsis" title={atividade.criado_por || 'N/A'}>
            {atividade.criado_por ? atividade.criado_por.split('@')[0] : 'N/A'}
          </span>
        </div>
      </SimpleTableCell>
    );
  };

  private renderAtivoCell = (
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<IAtividade>,
    atividade: IAtividade
  ): JSX.Element => {
    return (
      <SimpleTableCell
        columnIndex={columnIndex}
        tableColumn={tableColumn}
        key={`col-${columnIndex}`}
      >
        <div className="flex-row flex-center">
          <input
            type="checkbox"
            checked={atividade.ativo}
            readOnly
            style={{ cursor: 'default' }}
          />
        </div>
      </SimpleTableCell>
    );
  };

  private renderAcoesCell = (
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<IAtividade>,
    atividade: IAtividade
  ): JSX.Element => {
    return (
      <SimpleTableCell
        columnIndex={columnIndex}
        tableColumn={tableColumn}
        key={`col-${columnIndex}`}
      >
        <div className="flex-row">
          <Button
            iconProps={{ iconName: 'Edit' }}
            ariaLabel="Editar"
            onClick={() => this.editarAtividade(atividade.id)}
            subtle={true}
          />
          <Button
            iconProps={{ iconName: 'Delete' }}
            ariaLabel="Remover"
            onClick={() => this.abrirDialogExclusao(atividade.id)}
            subtle={true}
          />
        </div>
      </SimpleTableCell>
    );
  };

  private renderProjetoSection = (): React.ReactNode => {
    const { hubMode, projectNameReadOnly, projetos, isLoadingProjetos, projetoSelecionado } = this.state;

    if (hubMode === 'project' && projectNameReadOnly) {
      // 🎯 Project Hub: Mostrar como read-only
      return (
        <div className="projeto-section read-only" style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Projeto
          </label>
          <TextField
            value={projectNameReadOnly}
            readOnly={true}
            placeholder="Projeto"
            width={TextFieldWidth.auto}
          />
          <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
            ℹ️ Você pode gerenciar atividades apenas para este projeto.
          </small>
        </div>
      );
    }

    // 🎯 Collection Hub: Dropdown normal
    return (
      <div className="projeto-section" style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Projeto *
        </label>
        <Dropdown
          items={projetos}
          selection={this.projetoSelection}
          disabled={isLoadingProjetos || projetos.length === 0}
          placeholder="Selecione um projeto"
        />
        {projetos.length === 0 && !isLoadingProjetos && (
          <small style={{ display: 'block', marginTop: '8px', color: '#d32f2f' }}>
            ⚠️ Nenhum projeto disponível.
          </small>
        )}
      </div>
    );
  };

  render() {
    const { atividades, nomeAtividade, descricao, projetos, isLoading, isLoadingProjetos, isLoadingAtividades, errorMessage, successMessage, dialogAberto, atividadeParaExcluir, atividadeEmEdicao } = this.state;

    const columns: ITableColumn<IAtividade>[] = [
      {
        id: 'atividade',
        name: 'Atividade',
        width: new ObservableValue(-30),
        renderCell: this.renderAtividadeCell
      },
      {
        id: 'projeto',
        name: 'Projeto',
        width: new ObservableValue(-20),
        renderCell: this.renderProjetoCell
      },
      {
        id: 'descricao',
        name: 'Descrição',
        width: new ObservableValue(-20),
        renderCell: this.renderDescricaoCell
      },
      {
        id: 'criado_por',
        name: 'Criado por',
        width: new ObservableValue(-15),
        renderCell: this.renderCriadoPorCell
      },
      {
        id: 'ativo',
        name: 'Ativo',
        width: new ObservableValue(-10),
        renderCell: this.renderAtivoCell
      },
      {
        id: 'acoes',
        name: 'Ações',
        width: new ObservableValue(-5),
        renderCell: this.renderAcoesCell
      }
    ];

    const commandBarItems = [
      {
        id: 'btn-adicionar',
        text: 'Adicionar',
        iconProps: { iconName: 'Add' },
        onClick: this.adicionarAtividade,
        important: true,
      }
    ];

    return (
      <div ref={this.rootRef} className="atividades-cadastro-container">
        <Header
            title="Gestão de Atividades"
            titleSize={TitleSize.Large}
            commandBarItems={commandBarItems}
            separator={true}
          />

          <div className="page-content-wrapper">
            {/* Messages */}
            {errorMessage && (
              <MessageCard
                severity={MessageCardSeverity.Error}
                onDismiss={() => this.safeSetState({ errorMessage: null })}
              >
                {errorMessage}
              </MessageCard>
            )}

            {/* Form Card */}
            <Card className="form-card">
              <div className="flex-column" style={{ padding: '16px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Cadastro de Atividade</h3>

                {/* Form Grid Row */}
                <div className="form-row-grid">
                  {/* Campo Projeto */}
                  <div className="form-field-projeto">
                    <label htmlFor="projeto-dropdown" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                      Projeto *
                    </label>
                    <Dropdown
                      items={projetos}
                      selection={this.projetoSelection}
                      disabled={isLoadingProjetos || projetos.length === 0}
                      placeholder="Selecione um projeto"
                    />
                    {projetos.length === 0 && !isLoadingProjetos && (
                      <small style={{ display: 'block', marginTop: '4px', color: '#d32f2f', fontSize: '11px' }}>
                        ⚠️ Nenhum projeto
                      </small>
                    )}
                  </div>

                  {/* Campo Nome */}
                  <div className="form-field-standard">
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                      Nome *
                    </label>
                    <TextField
                      value={nomeAtividade}
                      onChange={this.onNomeAtividadeChange}
                      placeholder="Digite o nome"
                      width={TextFieldWidth.standard}
                      ariaLabel="Nome da atividade"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Campo Descrição */}
                  <div className="form-field-standard">
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                      Descrição
                    </label>
                    <TextField
                      value={descricao}
                      onChange={this.onDescricaoChange}
                      placeholder="Digite uma descrição"
                      width={TextFieldWidth.standard}
                      ariaLabel="Descrição da atividade"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Info Text */}
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                  {atividadeEmEdicao ? (
                    <span>✏️ Modo edição: <strong>{atividadeEmEdicao}</strong></span>
                  ) : (
                    <span>* campos obrigatórios</span>
                  )}
                </div>

                {/* Action Buttons only in edit mode */}
                {atividadeEmEdicao && (
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <Button
                      text={isLoading ? "Salvando..." : "Atualizar"}
                      primary={true}
                      onClick={this.adicionarAtividade}
                      iconProps={{ iconName: isLoading ? 'Sync' : 'Save' }}
                      disabled={isLoading}
                    />
                    <Button
                      text="Cancelar"
                      onClick={this.cancelarEdicao}
                      disabled={isLoading}
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* TABLE CARD */}
            {!isLoadingAtividades && atividades.length > 0 && (
              <Card className="table-card">
                <div className="flex-column" style={{ padding: '16px' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '12px' }}>
                    Lista de Atividades ({atividades.length})
                  </h3>
                  <div className="h-scroll-auto">
                    <Table
                      columns={columns}
                      itemProvider={new ArrayItemProvider(atividades)}
                      role="table"
                      containerClassName="h-scroll-auto"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Loading State */}
            {isLoadingAtividades && (
              <div className="flex-row flex-center" style={{
                padding: '32px',
                color: '#666',
                textAlign: 'center'
              }}>
                <div>
                  <Icon iconName="Sync" size={IconSize.large} style={{ marginBottom: '8px' }} />
                  <p>Carregando atividades...</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoadingAtividades && atividades.length === 0 && (
              <div className="flex-row flex-center" style={{
                padding: '32px',
                color: '#666',
                textAlign: 'center'
              }}>
                <div>
                  <Icon iconName="Add" size={IconSize.large} style={{ marginBottom: '8px', opacity: 0.3 }} />
                  <p>Nenhuma atividade cadastrada.</p>
                  <p style={{ fontSize: '12px', marginTop: '8px', color: '#999' }}>
                    Use o formulário acima para adicionar sua primeira atividade.
                  </p>
                </div>
              </div>
            )}
          </div>

        {/* Dialog de Confirmação de Exclusão */}
        {dialogAberto && atividadeParaExcluir && (
          <Dialog
            titleProps={{ text: 'Confirmar Exclusão' }}
            footerButtonProps={[
              {
                text: 'Cancelar',
                onClick: this.fecharDialog
              },
              {
                text: 'Excluir',
                onClick: this.confirmarExclusao,
                primary: true,
                danger: true
              }
            ]}
            onDismiss={this.fecharDialog}
          >
            <p>
              Tem certeza que deseja excluir a atividade <strong>"{atividadeParaExcluir.nome}"</strong>?
            </p>
            <p style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>
              Esta ação não poderá ser desfeita.
            </p>
          </Dialog>
        )}
      </div>
    );
  }
}
