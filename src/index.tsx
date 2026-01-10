import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as SDK from 'azure-devops-extension-sdk';
import { AtividadesCadastro } from './components/AtividadesCadastro';

// Inicializar o SDK do Azure DevOps
SDK.init({
  loaded: false,
  applyTheme: true
});

// Registrar quando a extensão estiver pronta
SDK.ready().then(() => {
  // Renderizar o componente principal
  ReactDOM.render(
    <AtividadesCadastro />,
    document.getElementById('root')
  );

  // Notificar que a extensão foi carregada
  SDK.notifyLoadSucceeded();
});
