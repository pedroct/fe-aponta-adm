import * as React from 'react';
import * as SDK from 'azure-devops-extension-sdk';

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = React.createContext<AuthContextType>({
  token: null,
  isLoading: true,
  error: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Esperar o SDK estar pronto
        await SDK.ready();
        
        // Obter o token de acesso do usuário autenticado
        const accessToken = await SDK.getAccessToken();
        
        if (mounted) {
          if (accessToken) {
            setToken(accessToken);
            setError(null);
            console.log('[AuthContext] Token obtido com sucesso do Azure DevOps SDK');
          } else {
            setError('Não foi possível obter token de autenticação');
            console.warn('[AuthContext] Nenhum token disponível');
          }
        }
      } catch (err: any) {
        if (mounted) {
          const errorMsg = err?.message || 'Erro ao obter token de autenticação';
          setError(errorMsg);
          console.error('[AuthContext] Erro ao inicializar autenticação:', err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
