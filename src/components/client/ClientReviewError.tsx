
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ErrorInfo {
  type: string;
  message: string;
  details?: string;
}

interface ClientReviewErrorProps {
  error: ErrorInfo;
  campaignId?: string;
  onRetry: () => void;
}

const ClientReviewError: React.FC<ClientReviewErrorProps> = ({
  error,
  campaignId,
  onRetry
}) => {
  const { toast } = useToast();

  const getErrorIcon = () => {
    switch (error?.type) {
      case 'ID_INVALIDO': return '🔗';
      case 'CAMPANHA_NAO_ENCONTRADA': return '🔍';
      case 'CONEXAO_ERRO': return '📡';
      case 'CONSULTA_ERRO': return '🗄️';
      default: return '😔';
    }
  };

  const getErrorColor = () => {
    switch (error?.type) {
      case 'CONEXAO_ERRO': return 'border-orange-200 bg-orange-50';
      case 'ID_INVALIDO': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const copyDebugInfo = () => {
    const debugInfo = {
      campaignId,
      url: window.location.href,
      error: error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    toast({
      title: "Informações copiadas",
      description: "Informações de debug copiadas para a área de transferência"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto p-6">
        <div className="text-6xl mb-4">{getErrorIcon()}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error?.message || 'Erro inesperado'}
        </h2>
        
        <div className={`space-y-4 text-gray-600 mb-6 p-4 rounded-lg border ${getErrorColor()}`}>
          {error?.details && (
            <p className="text-sm">{error.details}</p>
          )}
          
          <div className="space-y-2 text-left">
            <div className="bg-white p-3 rounded border">
              <p className="text-xs text-gray-500 mb-1">
                <strong>ID da campanha:</strong>
              </p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
                {campaignId || 'não fornecido'}
              </code>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <p className="text-xs text-gray-500 mb-1">
                <strong>URL:</strong>
              </p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
                {window.location.href}
              </code>
            </div>
            
            {error?.type && (
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-gray-500 mb-1">
                  <strong>Tipo do erro:</strong>
                </p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {error.type}
                </code>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 justify-center mb-4">
          <Button 
            onClick={onRetry} 
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Recarregar Página
          </Button>
        </div>
        
        <Button 
          onClick={copyDebugInfo}
          variant="ghost"
          size="sm"
          className="text-gray-500"
        >
          <Copy className="w-3 h-3 mr-1" />
          Copiar Info Debug
        </Button>
      </div>
    </div>
  );
};

export default ClientReviewError;
