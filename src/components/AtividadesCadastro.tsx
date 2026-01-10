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

import 'azure-devops-ui/Core/override.css';
import { criarAtividade, Atividade, listarProjetos, Projeto, listarAtividades, AtividadeResponse, excluirAtividade, atualizarAtividade } from '../services/apiService';

interface IAtividade {
  id: string;
  nome: string;
  descricao: string;
  nome_projeto: string;
  ativo: boolean;
  id_projeto: string;
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
}> {
  private projetoSelection = new DropdownSelection();

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
      atividadeEmEdicao: null
    };
  }

  async componentDidMount() {
    console.log('[AtividadesCadastro] Montado em:', new Date().toISOString());

    // Observar mudanças na seleção do dropdown
    this.projetoSelection.subscribe(this.onProjetoChange);

    // Carregar projetos da API primeiro
    await this.carregarProjetos();

    // Depois carregar atividades da API (que dependem dos projetos)
    await this.carregarAtividades();
  }

  componentWillUnmount() {
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
    this.setState({ isLoadingProjetos: true });

    try {
      const projetosData = await listarProjetos();

      // Converter projetos da API para o formato do dropdown
      const projetosDropdown: IListBoxItem[] = projetosData.map(projeto => ({
        id: projeto.id,
        text: projeto.nome
      }));

      this.setState({
        projetos: projetosDropdown,
        isLoadingProjetos: false
      });
    } catch (error) {
      this.setState({
        isLoadingProjetos: false,
        errorMessage: error instanceof Error ? error.message : 'Erro ao carregar projetos'
      });
    }
  };

  private carregarAtividades = async () => {
    this.setState({ isLoadingAtividades: true });

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
        id_projeto: atividade.id_projeto
      }));

      console.log('Atividades processadas:', atividadesTabela);

      this.setState({
        atividades: atividadesTabela,
        isLoadingAtividades: false
      });
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      this.setState({
        isLoadingAtividades: false,
        errorMessage: error instanceof Error ? error.message : 'Erro ao carregar atividades'
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
    const { nomeAtividade, descricao, projetoSelecionado, atividadeEmEdicao } = this.state;

    if (!nomeAtividade.trim() || !projetoSelecionado) {
      this.setState({
        errorMessage: 'Por favor, preencha todos os campos obrigatórios',
        successMessage: null
      });
      return;
    }

    // Limpar mensagens anteriores
    this.setState({
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
        id_projeto: projetoSelecionado.id as string
      };

      if (atividadeEmEdicao) {
        // Atualizar atividade existente
        const response = await atualizarAtividade(atividadeEmEdicao, atividadeData);

        // Atualizar na lista local
        const atividadeAtualizada: IAtividade = {
          id: response.id,
          nome: response.nome,
          descricao: response.descricao,
          nome_projeto: response.nome_projeto || projetoSelecionado.text || '',
          ativo: response.ativo,
          id_projeto: response.id_projeto
        };

        this.setState({
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
          nome_projeto: response.nome_projeto || projetoSelecionado.text || '',
          ativo: response.ativo,
          id_projeto: response.id_projeto
        };

        this.setState({
          atividades: [...this.state.atividades, novaAtividade],
          nomeAtividade: '',
          descricao: '',
          projetoSelecionado: undefined,
          isLoading: false,
          successMessage: 'Atividade criada com sucesso!'
        });
      }

      // Limpar seleção do dropdown
      this.projetoSelection.clear();

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        this.setState({ successMessage: null });
      }, 3000);

    } catch (error) {
      this.setState({
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
      this.setState({
        atividades: this.state.atividades.filter(a => a.id !== atividadeParaExcluir.id),
        successMessage: 'Atividade removida com sucesso!'
      });

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        this.setState({ successMessage: null });
      }, 3000);

    } catch (error) {
      this.setState({
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
        width: new ObservableValue(-30),
        renderCell: this.renderDescricaoCell
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
        width: new ObservableValue(-10),
        renderCell: this.renderAcoesCell
      }
    ];

    return (
      <div className="page-content page-content-top flex-column rhythm-vertical-16">
        <Card
          className="flex-grow bolt-card-no-vertical-padding"
          titleProps={{ text: 'Gestão de Atividades' }}
        >
          <div className="flex-column" style={{ padding: '16px' }}>
            {/* Mensagens de Erro e Sucesso */}
            {(errorMessage || successMessage) && (
              <div style={{ marginBottom: '20px' }}>
                {errorMessage && (
                  <MessageCard
                    severity={MessageCardSeverity.Error}
                    onDismiss={() => this.setState({ errorMessage: null })}
                  >
                    {errorMessage}
                  </MessageCard>
                )}
                {successMessage && (
                  <MessageCard
                    severity={MessageCardSeverity.Info}
                    onDismiss={() => this.setState({ successMessage: null })}
                  >
                    {successMessage}
                  </MessageCard>
                )}
              </div>
            )}

            {/* Formulário de Cadastro */}
            <div className="flex-column" style={{ marginBottom: '16px', gap: '12px' }}>
              <div className="flex-row rhythm-horizontal-8">
                <div style={{ flex: '1' }}>
                  <TextField
                    value={nomeAtividade}
                    onChange={this.onNomeAtividadeChange}
                    placeholder="Digite o nome da atividade *"
                    width={TextFieldWidth.standard}
                    ariaLabel="Nome da atividade"
                    disabled={isLoading}
                  />
                </div>
                <div style={{ flex: '1' }}>
                  <Dropdown
                    ariaLabel="Selecione um projeto"
                    placeholder={isLoadingProjetos ? "Carregando projetos..." : "Selecione um projeto *"}
                    items={projetos}
                    selection={this.projetoSelection}
                    onSelect={(event, item) => {
                      this.setState({ projetoSelecionado: item });
                    }}
                    disabled={isLoading || isLoadingProjetos}
                  />
                </div>
              </div>
              <div className="flex-row rhythm-horizontal-8">
                <div style={{ flex: '1' }}>
                  <TextField
                    value={descricao}
                    onChange={this.onDescricaoChange}
                    placeholder="Digite uma descrição (opcional)"
                    width={TextFieldWidth.standard}
                    ariaLabel="Descrição da atividade"
                    multiline={true}
                    rows={2}
                    disabled={isLoading}
                  />
                </div>
                <div style={{ flex: '0 0 auto', alignSelf: 'flex-start', display: 'flex', gap: '8px' }}>
                  <Button
                    text={isLoading ? "Salvando..." : (atividadeEmEdicao ? "Atualizar" : "Adicionar")}
                    primary={true}
                    onClick={this.adicionarAtividade}
                    iconProps={{ iconName: isLoading ? 'Sync' : (atividadeEmEdicao ? 'Save' : 'Add') }}
                    disabled={isLoading}
                  />
                  {atividadeEmEdicao && (
                    <Button
                      text="Cancelar"
                      onClick={this.cancelarEdicao}
                      disabled={isLoading}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Loading de Atividades */}
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

            {/* Tabela de Atividades */}
            {!isLoadingAtividades && atividades.length > 0 && (
              <div className="flex-column" style={{ marginTop: '24px' }}>
                <h3 style={{ marginBottom: '8px' }}>Lista de Atividades ({atividades.length})</h3>
                <Table
                  columns={columns}
                  itemProvider={new ArrayItemProvider(atividades)}
                  role="table"
                  containerClassName="h-scroll-auto"
                />
              </div>
            )}

            {/* Mensagem quando não há atividades */}
            {!isLoadingAtividades && atividades.length === 0 && (
              <div className="flex-row flex-center" style={{
                padding: '32px',
                color: '#666',
                textAlign: 'center'
              }}>
                <div>
                  <Icon iconName="Add" size={IconSize.large} style={{ marginBottom: '8px', opacity: 0.3 }} />
                  <p>Nenhuma atividade cadastrada. Adicione sua primeira atividade acima.</p>
                  <p style={{ fontSize: '12px', marginTop: '8px' }}>
                    Projetos carregados: {projetos.length} | API: {process.env.API_BASE_URL || 'http://localhost:8000'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

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
