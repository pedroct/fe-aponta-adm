import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as SDK from 'azure-devops-extension-sdk';
import { GerirAtividade } from './components/GerirAtividade';
import { AuthProvider, useAuth } from './context/AuthContext';
import { setAzureDevOpsToken } from './services/apiService';

// Componente wrapper que usa o contexto de autenticação
function AppWithAuth() {
  const { token, isLoading, error } = useAuth();

  React.useEffect(() => {
    if (token) {
      setAzureDevOpsToken(token);
      console.log('[App] Token do Azure DevOps configurado no serviço de API');
    }
  }, [token]);

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Carregando autenticação...</div>;
  }

  if (error) {
    console.warn('[App] Erro de autenticação:', error);
    // Continuar mesmo com erro de autenticação
  }

  return <GerirAtividade />;
}

// Função para renderizar a aplicação
function renderApp() {
  ReactDOM.render(
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>,
    document.getElementById('root')
  );
}

// Tentar inicializar o SDK do Azure DevOps quando disponível.
// Em modo standalone (http-server / localhost) o handshake pode falhar —
// nesse caso caímos back para renderizar a aplicação sem o SDK.
try {
  SDK.init({ loaded: false, applyTheme: true });

  SDK.ready()
    .then(() => {
      renderApp();
      try { SDK.notifyLoadSucceeded(); } catch (e) { /* ignore */ }
    })
    .catch(err => {
      console.warn('Azure DevOps SDK handshake failed, rendering standalone:', err);
      renderApp();
    });
} catch (err) {
  console.warn('Azure DevOps SDK not available, rendering standalone:', err);
  renderApp();
}
