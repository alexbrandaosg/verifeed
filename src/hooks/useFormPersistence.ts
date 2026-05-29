import { useState, useEffect, useCallback } from 'react';

interface FormData {
  [key: string]: any;
}

export const useFormPersistence = <T extends FormData>(
  key: string,
  initialData: T,
  autoSaveDelay: number = 1000
) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Função para serializar dados (converter Date para string)
  const serializeData = (data: T): any => {
    const serialized: any = { ...data };
    Object.keys(serialized).forEach(key => {
      if (serialized[key] instanceof Date) {
        serialized[key] = serialized[key].toISOString();
      }
    });
    return serialized;
  };

  // Função para deserializar dados (converter string para Date quando apropriado)
  const deserializeData = (data: any, original: T): T => {
    const deserialized: any = { ...data };
    Object.keys(original).forEach(key => {
      if (original[key] instanceof Date && typeof data[key] === 'string') {
        deserialized[key] = new Date(data[key]);
      }
    });
    return deserialized as T;
  };

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(`form_${key}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log('Dados do formulário restaurados:', key, parsed);
        const deserializedData = deserializeData(parsed.data, initialData);
        setFormData({ ...initialData, ...deserializedData });
        setLastSaved(new Date(parsed.timestamp));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do formulário:', error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // Salvar dados no localStorage
  const saveToStorage = useCallback((data: T) => {
    try {
      const toSave = {
        data: serializeData(data),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`form_${key}`, JSON.stringify(toSave));
      setLastSaved(new Date());
      console.log('Dados do formulário salvos:', key, data);
    } catch (error) {
      console.error('Erro ao salvar dados do formulário:', error);
    }
  }, [key]);

  // Auto-save com debounce
  useEffect(() => {
    if (isLoading) return;

    const timeoutId = setTimeout(() => {
      saveToStorage(formData);
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [formData, autoSaveDelay, saveToStorage, isLoading]);

  // Função para atualizar os dados do formulário
  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Função para limpar os dados salvos
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(`form_${key}`);
      setLastSaved(null);
      console.log('Dados do formulário limpos:', key);
    } catch (error) {
      console.error('Erro ao limpar dados do formulário:', error);
    }
  }, [key]);

  // Função para resetar o formulário
  const resetForm = useCallback(() => {
    setFormData(initialData);
    clearSavedData();
  }, [initialData, clearSavedData]);

  return {
    formData,
    updateFormData,
    resetForm,
    clearSavedData,
    isLoading,
    lastSaved,
    saveToStorage: () => saveToStorage(formData)
  };
};
