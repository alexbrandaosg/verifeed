import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';

// Timezone de São Paulo (GMT-3)
const SAO_PAULO_TZ = 'America/Sao_Paulo';

/**
 * Converte uma data para o formato YYYY-MM-DD em timezone de São Paulo
 * Usado para salvar datas no banco de dados
 */
export const formatDateForDatabase = (date: Date): string => {
  const zonedDate = toZonedTime(date, SAO_PAULO_TZ);
  const year = zonedDate.getFullYear();
  const month = String(zonedDate.getMonth() + 1).padStart(2, '0');
  const day = String(zonedDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converte uma string de data (YYYY-MM-DD) para um objeto Date em timezone de São Paulo
 * Usado para ler datas do banco de dados
 */
export const parseDateFromDatabase = (dateString: string): Date => {
  // Se a data já vier no formato completo do PocketBase (ex: "2023-10-01 12:00:00.000Z")
  // ou já contiver um "T", não adicionamos horário artificial.
  if (dateString.includes('T') || dateString.includes(' ')) {
    return toZonedTime(new Date(dateString), SAO_PAULO_TZ);
  }
  // Fallback para datas curtas "YYYY-MM-DD"
  return toZonedTime(new Date(dateString + 'T12:00:00'), SAO_PAULO_TZ);
};

/**
 * Retorna a data atual em timezone de São Paulo
 */
export const getCurrentDateSP = (): Date => {
  return toZonedTime(new Date(), SAO_PAULO_TZ);
};

/**
 * Formata uma data para exibição em timezone de São Paulo
 */
export const formatDateDisplaySP = (date: Date, formatString: string = 'dd/MM/yyyy'): string => {
  const zonedDate = toZonedTime(date, SAO_PAULO_TZ);
  return format(zonedDate, formatString, { timeZone: SAO_PAULO_TZ });
};
