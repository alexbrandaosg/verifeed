import { useState } from 'react';
import { pb } from '@/lib/pocketbase';
import { Campaign } from '@/types/campaign';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useCampaignOperations = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'posts' | 'shareLink' | 'clientEmail' | 'userId'>) => {
    try {
      console.log('Criando nova campanha:', campaignData);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const newCampaignData = {
        title: campaignData.title,
        description: campaignData.description,
        client_name: campaignData.clientName,
        client_email: 'gerado@verifeed.com', // mock ou o que foi definido
        share_link: Math.random().toString(36).substring(7),
        user: user.id
      };

      const data = await pb.collection('campaigns').create(newCampaignData);

      const newCampaign: Campaign = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        clientName: data.client_name,
        clientEmail: data.client_email || '',
        userId: user.id,
        shareLink: data.share_link,
        createdAt: new Date(data.created),
        updatedAt: new Date(data.updated),
        posts: []
      };
      
      toast({
        title: "Sucesso!",
        description: "Campanha criada com sucesso."
      });
      
      return newCampaign;
    } catch (error) {
      console.error('Erro completo ao criar campanha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a campanha",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCampaign = async (campaignId: string, updates: { title?: string; clientName?: string; description?: string }) => {
    try {
      console.log('Atualizando campanha:', campaignId, 'com dados:', updates);

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.clientName !== undefined) updateData.client_name = updates.clientName;
      if (updates.description !== undefined) updateData.description = updates.description;

      const data = await pb.collection('campaigns').update(campaignId, updateData);

      toast({
        title: "Sucesso!",
        description: "Campanha atualizada com sucesso."
      });

      return data;
    } catch (error) {
      console.error('Erro completo ao atualizar campanha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a campanha",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      console.log('=== INICIANDO EXCLUSÃO DE CAMPANHA ===');
      console.log('ID da campanha:', campaignId);

      // PocketBase não tem RPC nativo de cascade delete se não configurado,
      // então podemos precisar deletar os posts antes, ou configurar cascade delete na UI do PB.
      // Assumiremos que o backend vai lidar com cascade ou apagamos manualmente aqui os posts.
      
      const posts = await pb.collection('posts').getFullList({ filter: `campaign = "${campaignId}"` });
      for (const p of posts) {
         const feedbacks = await pb.collection('post_feedbacks').getFullList({ filter: `post = "${p.id}"` });
         for (const f of feedbacks) {
             await pb.collection('post_feedbacks').delete(f.id);
         }
         await pb.collection('posts').delete(p.id);
      }

      await pb.collection('campaigns').delete(campaignId);

      toast({
        title: "Sucesso!",
        description: "Campanha excluída permanentemente."
      });

    } catch (error) {
      console.error('=== ERRO NA EXCLUSÃO ===');
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: `Não foi possível excluir a campanha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    createCampaign,
    updateCampaign,
    deleteCampaign
  };
};
