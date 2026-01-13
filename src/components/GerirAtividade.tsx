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
  Icon,
  IconSize
} from 'azure-devops-ui/Icon';
import {
  Header,
  TitleSize
} from 'azure-devops-ui/Header';
import '../styles/gerir-atividade.css';

interface Projeto {
  id: string;
  text: string;
}

interface Atividade {
  id: string;
  nome: string;
  descricao: string;
  projeto: string;
  ativo: boolean;
  criadoPor: string;
}

interface IGerirAtividadeState {
  nomeProjeto: string;
  nomeAtividade: string;
  descricao: string;
  atividades: Atividade[];
}

export class GerirAtividade extends React.Component<{}, IGerirAtividadeState> {
  private projetoSelection = new DropdownSelection();
  private rootRef = React.createRef<HTMLDivElement>();

  constructor(props: {}) {
    super(props);
    this.state = {
      nomeProjeto: '',
      nomeAtividade: '',
      descricao: '',
      atividades: [
        {
          id: '1',
          nome: 'Refatoração de funcionalidade',
          descricao: 'Refatoração de funcionalidade.',
          projeto: 'DEV',
          ativo: true,
          criadoPor: 'pedro.teixeira'
        },
        {
          id: '2',
          nome: 'Modelagem de Banco de Dados',
          descricao: 'Modelagem de banco e dados para atender o projeto.',
          projeto: 'DEMO',
          ativo: true,
          criadoPor: 'pedro.teixeira'
        },
        {
          id: '3',
          nome: 'Refinamento de HU',
          descricao: 'Refinamento de História de Usuário.',
          projeto: 'DEMO',
          ativo: true,
          criadoPor: 'pedro.teixeira'
        }
      ]
    };
  }

  // Handlers para mudanças nos campos
  onNomeAtividadeChange = (event: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
    this.setState({ nomeAtividade: newValue || '' });
  };

  onDescricaoChange = (event: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
    this.setState({ descricao: newValue || '' });
  };

  // Adicionar atividade
  adicionarAtividade = () => {
    const { nomeAtividade, descricao, nomeProjeto, atividades } = this.state;

    if (!nomeAtividade || !nomeProjeto) {
      return;
    }

    const novaAtividade: Atividade = {
      id: String(Date.now()),
      nome: nomeAtividade,
      descricao,
      projeto: nomeProjeto,
      ativo: true,
      criadoPor: 'usuario@example.com'
    };

    this.setState({
      atividades: [...atividades, novaAtividade],
      nomeAtividade: '',
      descricao: '',
      nomeProjeto: ''
    });
  };

  // Deletar atividade
  deletarAtividade = (id: string) => {
    const { atividades } = this.state;
    this.setState({
      atividades: atividades.filter(a => a.id !== id)
    });
  };

  render() {
    const { nomeAtividade, descricao, atividades } = this.state;

    // Dados dos projetos (mockado)
    const projetos: Projeto[] = [
      { id: 'dev', text: 'DEV' },
      { id: 'demo', text: 'DEMO' },
      { id: 'prod', text: 'PROD' }
    ];

    // Colunas da tabela
    const columns: ITableColumn<Atividade>[] = [
      {
        id: 'nome',
        name: 'Atividade',
        width: 250,
        onSize: () => { },
        renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<Atividade>, atividade: Atividade) => (
          <SimpleTableCell columnIndex={columnIndex} key={`${rowIndex}-${columnIndex}`}>{atividade.nome}</SimpleTableCell>
        )
      },
      {
        id: 'projeto',
        name: 'Projeto',
        width: 150,
        onSize: () => { },
        renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<Atividade>, atividade: Atividade) => (
          <SimpleTableCell columnIndex={columnIndex} key={`${rowIndex}-${columnIndex}`}>{atividade.projeto}</SimpleTableCell>
        )
      },
      {
        id: 'descricao',
        name: 'Descrição',
        width: 350,
        onSize: () => { },
        renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<Atividade>, atividade: Atividade) => (
          <SimpleTableCell columnIndex={columnIndex} key={`${rowIndex}-${columnIndex}`}>{atividade.descricao}</SimpleTableCell>
        )
      },
      {
        id: 'criadoPor',
        name: 'Criado por',
        width: 150,
        onSize: () => { },
        renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<Atividade>, atividade: Atividade) => (
          <SimpleTableCell columnIndex={columnIndex} key={`${rowIndex}-${columnIndex}`}>{atividade.criadoPor}</SimpleTableCell>
        )
      },
      {
        id: 'ativo',
        name: 'Ativo',
        width: 100,
        onSize: () => { },
        renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<Atividade>, atividade: Atividade) => (
          <SimpleTableCell columnIndex={columnIndex} key={`${rowIndex}-${columnIndex}`}>
            {atividade.ativo && <input type="checkbox" checked readOnly />}
          </SimpleTableCell>
        )
      },
      {
        id: 'acoes',
        name: 'Ações',
        width: 100,
        onSize: () => { },
        renderCell: (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<Atividade>, atividade: Atividade) => (
          <SimpleTableCell columnIndex={columnIndex} key={`${rowIndex}-${columnIndex}`}>
            <Button
              text=""
              iconProps={{ iconName: 'Edit' }}
              onClick={() => { }}
              ariaLabel="Editar"
            />
            <Button
              text=""
              iconProps={{ iconName: 'Delete' }}
              onClick={() => this.deletarAtividade(atividade.id)}
              ariaLabel="Deletar"
            />
          </SimpleTableCell>
        )
      }
    ];

    // Comandos do header
    const commandBarItems = [
      {
        id: 'adicionar',
        text: 'Adicionar',
        iconProps: { iconName: 'Add' },
        onClick: this.adicionarAtividade,
        ariaLabel: 'Adicionar nova atividade',
        style: {
          backgroundColor: '#0078d4',
          color: '#ffffff',
          border: 'none'
        }
      }
    ];

    return (
      <div ref={this.rootRef} className="gerir-atividade-wrapper">
        {/* Header */}
        <Header
          title="Gerir Atividades"
          titleSize={TitleSize.Large}
          commandBarItems={commandBarItems}
          separator={true}
        />

        {/* Page Content */}
        <div className="page-content">
          
          {/* Formulário */}
          <Card className="form-card">
            <div className="form-content">
              <h3 className="form-title">Cadastro de Atividade</h3>

              <div className="form-row">
                {/* Campo Projeto */}
                <div className="form-field">
                  <label className="form-label">
                    Projeto *
                  </label>
                  <Dropdown
                    items={projetos}
                    selection={this.projetoSelection}
                    placeholder="Selecione um projeto"
                  />
                </div>

                {/* Campo Nome */}
                <div className="form-field">
                  <label className="form-label">
                    Nome *
                  </label>
                  <TextField
                    value={nomeAtividade}
                    onChange={this.onNomeAtividadeChange}
                    placeholder="Digite o nome"
                    width={TextFieldWidth.standard}
                    ariaLabel="Nome da atividade"
                  />
                </div>

                {/* Campo Descrição */}
                <div className="form-field">
                  <label className="form-label">
                    Descrição
                  </label>
                  <TextField
                    value={descricao}
                    onChange={this.onDescricaoChange}
                    placeholder="Digite uma descrição"
                    width={TextFieldWidth.standard}
                    ariaLabel="Descrição da atividade"
                  />
                </div>
              </div>

              <div className="form-info">
                * campos obrigatórios
              </div>
            </div>
          </Card>

          {/* Tabela de Atividades */}
          <Card className="table-card">
            <div className="table-content">
              <h3 className="table-title">
                Lista de Atividades ({atividades.length})
              </h3>
              <div className="table-wrapper">
                <Table
                  columns={columns}
                  itemProvider={new ArrayItemProvider(atividades)}
                  role="table"
                  containerClassName="table-container"
                  showHeader={true}
                  showLines={true}
                />
              </div>
            </div>
          </Card>

        </div>
      </div>
    );
  }
}
