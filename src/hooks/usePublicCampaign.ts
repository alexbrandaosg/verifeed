import { useState } from 'react';
import { pb } from '@/lib/pocketbase';
import { Campaign, Post, PostFeedback } from '@/types/campaign';
import { useToast } from '@/hooks/use-toast';
import { parseDateFromDatabase } from '@/utils/dateUtils';

export const usePublicCampaign = () => {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getFeedbacksByPostId = async (postId: string): Promise<PostFeedback[]> => {
    try {
      const data = await pb.collection('post_feedbacks').getFullList({
        filter: `post = "${postId}"`,
        sort: '-created'
      });

      return (data || []).map((feedback: any) => ({
        id: feedback.id,
        feedbackText: feedback.feedback_text,
        feedbackImages: feedback.feedback_images || [],
        status: feedback.status as 'pending' | 'processed' | 'ignored',
        createdAt: new Date(feedback.created),
        processedAt: feedback.processed_at ? new Date(feedback.processed_at) : undefined
      }));
    } catch (error) {
      console.error('Erro ao buscar feedbacks:', error);
      return [];
    }
  };

  const getCampaignById = async (campaignId: string): Promise<Campaign | null> => {
    try {
      console.log('=== CARREGANDO CAMPANHA PÚBLICA (VERSÃO ROBUSTA) ===');
      setLoading(true);
      
      // Health check PocketBase
      try {
        await pb.health.check({ $autoCancel: false });
      } catch (healthError: any) {
        throw new Error(`CONEXAO_ERRO: ${healthError.message}`);
      }
      
      console.log('🔍 Buscando campanha no banco de dados...');
      let campaignData;
      try {
        campaignData = await pb.collection('campaigns').getFirstListItem(`share_link = "${campaignId}"`);
      } catch (err) {
        campaignData = await pb.collection('campaigns').getOne(campaignId);
      }

      if (!campaignData) {
        throw new Error(`CAMPANHA_NAO_ENCONTRADA: Nenhuma campanha encontrada com o ID "${campaignId}"`);
      }

      console.log('🔍 Buscando posts da campanha...');
      let postsData: any[] = [];
      try {
        postsData = await pb.collection('posts').getFullList({
          filter: `campaign = "${campaignData.id}"`,
          sort: '-created'
        });
      } catch (postsError) {
        console.error('⚠️ Erro ao carregar posts:', postsError);
      }

      const postsWithFeedbacks = await Promise.all(
        postsData.map(async (post: any) => {
          const feedbacks = await getFeedbacksByPostId(post.id);
          return {
            id: post.id,
            title: post.title,
            description: post.description,
            images: post.images || [],
            status: post.status,
            feedback: post.feedback,
            feedbackImages: post.feedback_images || [],
            feedbacks,
            scheduledDate: post.scheduled_date ? parseDateFromDatabase(post.scheduled_date) : undefined,
            createdAt: new Date(post.created),
            updatedAt: new Date(post.updated)
          };
        })
      );

      const campaign: Campaign = {
        id: campaignData.id,
        title: campaignData.title,
        description: campaignData.description || '',
        clientName: campaignData.client_name,
        clientEmail: campaignData.client_email,
        userId: campaignData.user,
        shareLink: campaignData.share_link,
        createdAt: new Date(campaignData.created),
        updatedAt: new Date(campaignData.updated),
        posts: postsWithFeedbacks
      };
      
      return campaign;
    } catch (error) {
      console.error('Erro completo ao carregar campanha pública:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addFeedback = async (postId: string, feedbackText: string, feedbackImages: string[] = []) => {
    try {
      const newFeedbackData = {
          post: postId,
          feedback_text: feedbackText,
          feedback_images: feedbackImages,
          status: 'pending'
      };

      const data = await pb.collection('post_feedbacks').create(newFeedbackData);

      await pb.collection('posts').update(postId, { status: 'revision_requested' });
      
      toast({
        title: "Feedback enviado!",
        description: "Sua solicitação de alteração foi enviada para a agência."
      });

      return {
        id: data.id,
        feedbackText: data.feedback_text,
        feedbackImages: data.feedback_images || [],
        status: data.status as 'pending' | 'processed' | 'ignored',
        createdAt: new Date(data.created),
        processedAt: data.processed_at ? new Date(data.processed_at) : undefined
      };
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updatePost = async (postId: string, updates: Partial<Post>) => {
    try {
      const updateData: any = {};
      
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.feedback !== undefined) updateData.feedback = updates.feedback;
      if (updates.feedbackImages !== undefined) updateData.feedback_images = updates.feedbackImages;

      await pb.collection('posts').update(postId, updateData);
      
      toast({
        title: "Sucesso",
        description: "Post atualizado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o post",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    loading,
    getCampaignById,
    updatePost,
    addFeedback
  };
};
