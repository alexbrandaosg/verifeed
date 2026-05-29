import PocketBase from 'pocketbase';

// Substitua esta URL pela URL do seu Easypanel quando implantar na VPS
// Para desenvolvimento local, você pode usar http://127.0.0.1:8090 se rodar o PB localmente
export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'https://pocketbase.autocore.com.br');

// Você pode opcionalmente desativar o autoCancellation se tiver problemas com requisições sendo canceladas
pb.autoCancellation(false);
