import { useState } from 'react';
import { pb } from '@/lib/pocketbase';
import { PostFeedback } from '@/types/campaign';
import { useToast } from '@/hooks/use-toast';
import { transformDatabaseFeedbackToPostFeedback } from '@/utils/postTransformers';

export const usePostFeedbacks = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addFeedback = async (postId: string, feedbackText: string, feedbackImages: string[] = []) => {
    try {
      setLoading(true);
      console.log('Adicionando feedback ao post:', postId);
      
      const newFeedbackData = {
          post: postId,
          feedback_text: feedbackText,
          feedback_images: feedbackImages,
          status: 'pending'
      };

      const data = await pb.collection('post_feedbacks').create(newFeedbackData);

      // Atualizar status do post para revision_requested
      await pb.collection('posts').update(postId, { status: 'revision_requested' });

      const newFeedback: PostFeedback = transformDatabaseFeedbackToPostFeedback(data);

      toast({
        title: "Feedback enviado!",
        description: "Sua solicitação de alteração foi enviada para a agência."
      });

      return newFeedback;
    } catch (error) {
      console.error('Erro ao adicionar feedback:', error);
      toast({
        title: "Erro",
        description: `Não foi possível enviar o feedback: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const markAllFeedbacksAsProcessed = async (postId: string) => {
    try {
      const feedbacks = await pb.collection('post_feedbacks').getFullList({
        filter: `post = "${postId}" && status = "pending"`
      });

      for (const f of feedbacks) {
        await pb.collection('post_feedbacks').update(f.id, {
          status: 'processed',
          processed_at: new Date().toISOString()
        });
      }

      console.log('Feedbacks marcados como processados para post:', postId);
    } catch (error) {
      console.error('Erro ao processar feedbacks:', error);
      throw error;
    }
  };

  const getFeedbacksByPostId = async (postId: string): Promise<PostFeedback[]> => {
    try {
      const data = await pb.collection('post_feedbacks').getFullList({
        filter: `post = "${postId}"`,
        sort: '-created'
      });

      return (data || []).map(transformDatabaseFeedbackToPostFeedback);
    } catch (error) {
      console.error('Erro ao buscar feedbacks:', error);
      return [];
    }
  };

  return {
    loading,
    addFeedback,
    markAllFeedbacksAsProcessed,
    getFeedbacksByPostId
  };
};
