
interface ErrorInfo {
  type: string;
  message: string;
  details?: string;
}

export const parseError = (error: any): ErrorInfo => {
  if (!error) return { type: 'UNKNOWN', message: 'Erro desconhecido' };
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('ID_INVALIDO:')) {
    return {
      type: 'ID_INVALIDO',
      message: 'ID da campanha inválido',
      details: errorMessage.split('ID_INVALIDO:')[1]?.trim()
    };
  }
  
  if (errorMessage.includes('CAMPANHA_NAO_ENCONTRADA:')) {
    return {
      type: 'CAMPANHA_NAO_ENCONTRADA',
      message: 'Campanha não encontrada',
      details: 'Esta campanha pode ter sido removida ou o link pode estar incorreto'
    };
  }
  
  if (errorMessage.includes('CONEXAO_ERRO:')) {
    return {
      type: 'CONEXAO_ERRO',
      message: 'Erro de conexão',
      details: 'Não foi possível conectar ao servidor. Verifique sua conexão.'
    };
  }
  
  if (errorMessage.includes('CONSULTA_ERRO:')) {
    return {
      type: 'CONSULTA_ERRO',
      message: 'Erro no banco de dados',
      details: errorMessage.split('CONSULTA_ERRO:')[1]?.trim()
    };
  }
  
  return {
    type: 'GENERICO',
    message: 'Erro inesperado',
    details: errorMessage
  };
};

export const calculateStats = (posts: any[]) => {
  return {
    total: posts.length,
    approved: posts.filter(p => p.status === 'approved').length,
    pending: posts.filter(p => p.status === 'pending').length,
    revision: posts.filter(p => p.status === 'revision_requested').length
  };
};
