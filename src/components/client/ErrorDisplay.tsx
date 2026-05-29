
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error: Error | null;
  onRetry?: () => void;
  title?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  title = "Algo deu errado" 
}) => {
  if (!error) return null;

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="text-center py-8">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">
          {error.message || "Ocorreu um erro inesperado"}
        </p>
        {onRetry && (
          <Button 
            onClick={onRetry} 
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
