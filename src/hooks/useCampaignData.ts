import { pb } from '@/lib/pocketbase';
import { transformDatabasePostToPost } from '@/utils/postTransformers';
import { usePostFeedbacks } from './usePostFeedbacks';

export const useCampaignData = () => {
  const { getFeedbacksByPostId } = usePostFeedbacks();

  const getCampaignById = async (campaignId: string) => {
    try {
      console.log('Buscando campanha por ID:', campaignId);
      
      const data = await pb.collection('campaigns').getOne(campaignId);
      
      const postsData = await pb.collection('posts').getFullList({
        filter: `campaign = "${campaignId}"`,
      });

      console.log('Campanha encontrada:', data);

      // Buscar feedbacks para cada post
      const postsWithFeedbacks = await Promise.all(
        postsData.map(async (post: any) => {
          const feedbacks = await getFeedbacksByPostId(post.id);
          
          const dbPost = {
            id: post.id,
            campaign_id: post.campaign,
            title: post.title,
            description: post.description,
            status: post.status,
            images: post.images,
            feedback_images: post.feedback_images,
            feedback: post.feedback,
            scheduled_date: post.scheduled_date,
            created_at: post.created,
            updated_at: post.updated
          };
          
          return transformDatabasePostToPost(dbPost, feedbacks);
        })
      );

      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        clientName: data.client_name,
        clientEmail: data.client_email,
        shareLink: data.share_link,
        createdAt: new Date(data.created),
        updatedAt: new Date(data.updated),
        posts: postsWithFeedbacks
      };
    } catch (error) {
      console.error('Erro completo ao buscar campanha:', error);
      throw error;
    }
  };

  return {
    getCampaignById
  };
};
