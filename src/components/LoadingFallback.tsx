
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
  timeout?: number;
  onTimeout?: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = 'Carregando...',
  timeout = 15000, // 15 segundos
  onTimeout,
  onRetry,
  showRetry = false
}) => {
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setTimeElapsed(elapsed);
      
      if (elapsed >= timeout) {
        setIsTimedOut(true);
        onTimeout?.();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeout, onTimeout]);

  if (isTimedOut) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Carregamento Lento
          </h3>
          <p className="text-gray-600 mb-4">
            O carregamento está demorando mais que o esperado.
          </p>
          {(showRetry || onRetry) && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-lg mb-2">{message}</div>
        <div className="text-sm text-gray-500">
          {Math.round(timeElapsed / 1000)}s
        </div>
        
        {timeElapsed > 5000 && (
          <div className="mt-4 text-xs text-gray-400">
            Isso está demorando mais que o normal...
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingFallback;
