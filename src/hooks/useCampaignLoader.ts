import { useState } from 'react';
import { pb } from '@/lib/pocketbase';
import { Campaign, PostFeedback } from '@/types/campaign';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { parseDateFromDatabase } from '@/utils/dateUtils';

export const useCampaignLoader = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

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

  const loadCampaigns = async (useCache = true): Promise<Campaign[]> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Carregando campanhas do usuário:', user?.id);
      
      if (!user) {
        console.log('Usuário não autenticado');
        setLoading(false);
        return [];
      }

      console.log('Fazendo consulta ao banco com filter:', `user = "${user.id}"`);

      const campaigns = await pb.collection('campaigns').getFullList({
        filter: `user = "${user.id}"`
      });

      console.log('Resposta bruta do PocketBase:', campaigns);

      const detailedCampaigns = await Promise.all(
        (campaigns || []).map(async (campaign: any) => {
          
          const posts = await pb.collection('posts').getFullList({
             filter: `campaign = "${campaign.id}"`,
             sort: '-created'
          });

          const postsWithFeedbacks = await Promise.all(
            (posts || []).map(async (post: any) => {
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
                approvedAt: post.status === 'approved' ? new Date() : undefined,
                createdAt: new Date(post.created),
                updatedAt: new Date(post.updated)
              };
            })
          );

          return {
            id: campaign.id,
            title: campaign.title,
            description: campaign.description || '',
            clientName: campaign.client_name,
            clientEmail: campaign.client_email,
            userId: user.id,
            shareLink: campaign.share_link,
            createdAt: new Date(campaign.created),
            updatedAt: new Date(campaign.updated),
            posts: postsWithFeedbacks
          };
        })
      );

      console.log('Campanhas transformadas:', detailedCampaigns);
      return detailedCampaigns;
    } catch (error) {
      console.error('Erro completo ao carregar campanhas:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
      
      toast({
        title: "Erro",
        description: "Não foi possível carregar as campanhas. Tente novamente.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    loadCampaigns
  };
};
