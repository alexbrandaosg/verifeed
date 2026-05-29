
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseRobustLoadingOptions {
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
}

export const useRobustLoading = (options: UseRobustLoadingOptions = {}) => {
  const {
    timeout = 30000, // 30 segundos
    maxRetries = 3,
    retryDelay = 2000,
    onError
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const execute = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    showToast = true
  ): Promise<T | null> => {
    if (!isMountedRef.current) return null;

    setLoading(true);
    setError(null);

    // Timeout para evitar loading infinito
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        const timeoutError = new Error('Operação expirou após ' + (timeout / 1000) + ' segundos');
        setError(timeoutError);
        setLoading(false);
        onError?.(timeoutError);
      }
    }, timeout);

    try {
      const result = await asyncFunction();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (isMountedRef.current) {
        setLoading(false);
        setRetryCount(0);
      }

      return result;
    } catch (err) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const error = err instanceof Error ? err : new Error(String(err));
      
      if (isMountedRef.current) {
        setError(error);
        setLoading(false);
        onError?.(error);
      }

      return null;
    }
  }, [timeout, onError]);

  const retry = useCallback(async <T>(
    asyncFunction: () => Promise<T>
  ): Promise<T | null> => {
    if (retryCount >= maxRetries) {
      console.warn('Máximo de tentativas atingido');
      return null;
    }

    setRetryCount(prev => prev + 1);
    
    // Delay antes do retry
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    
    return execute(asyncFunction, false);
  }, [retryCount, maxRetries, retryDelay, execute]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setRetryCount(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    loading,
    error,
    retryCount,
    execute,
    retry,
    reset,
    canRetry: retryCount < maxRetries
  };
};
