import { useState } from 'react';
import { pb } from '@/lib/pocketbase';
import { Post } from '@/types/campaign';
import { useToast } from '@/hooks/use-toast';
import { formatDateForDatabase } from '@/utils/dateUtils';
import { transformDatabasePostToPost } from '@/utils/postTransformers';
import { usePostFeedbacks } from './usePostFeedbacks';

export const usePostOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { markAllFeedbacksAsProcessed, getFeedbacksByPostId } = usePostFeedbacks();

  const createPost = async (campaignId: string, postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'feedbacks'>) => {
    try {
      setLoading(true);
      console.log('Criando novo post para campanha:', campaignId, postData);
      
      if (!campaignId) {
        throw new Error('ID da campanha é obrigatório para criar um post');
      }
      
      const newPostData = {
          campaign: campaignId,
          title: postData.title,
          description: postData.description,
          images: postData.images,
          status: postData.status as 'pending' | 'approved' | 'revision_requested',
          feedback: postData.feedback,
          feedback_images: postData.feedbackImages || [],
          scheduled_date: postData.scheduledDate ? formatDateForDatabase(postData.scheduledDate) : null
      };

      const data = await pb.collection('posts').create(newPostData);

      console.log('Post criado no banco:', data);

      const newPost: Post = transformDatabasePostToPost(data, []);

      console.log('Post transformado:', newPost);
      
      toast({
        title: "Post criado!",
        description: "O novo post foi adicionado à campanha."
      });
      
      return newPost;
    } catch (error) {
      console.error('Erro completo ao criar post:', error);
      toast({
        title: "Erro",
        description: `Não foi possível criar o post: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId: string, updates: Partial<Post>) => {
    try {
      setLoading(true);
      console.log('Atualizando post:', postId, updates);
      
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.images !== undefined) updateData.images = updates.images;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.feedback !== undefined) updateData.feedback = updates.feedback;
      if (updates.feedbackImages !== undefined) updateData.feedback_images = updates.feedbackImages;
      if (updates.scheduledDate !== undefined) {
        updateData.scheduled_date = updates.scheduledDate 
          ? formatDateForDatabase(updates.scheduledDate)
          : null;
      }

      console.log('Dados para atualização:', updateData);

      const data = await pb.collection('posts').update(postId, updateData);

      // Marcar todos os feedbacks pendentes como processados quando o post é atualizado
      if (updates.title || updates.description || updates.images) {
        await markAllFeedbacksAsProcessed(postId);
      }

      console.log('Post atualizado no banco:', data);

      // Buscar feedbacks atualizados
      const feedbacks = await getFeedbacksByPostId(postId);

      const updatedPost: Post = transformDatabasePostToPost(data, feedbacks);

      toast({
        title: "Post atualizado!",
        description: "As alterações foram salvas com sucesso."
      });

      return updatedPost;
    } catch (error) {
      console.error('Erro completo ao atualizar post:', error);
      toast({
        title: "Erro",
        description: `Não foi possível atualizar o post: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      setLoading(true);
      console.log('=== INICIANDO EXCLUSÃO DE POST ===');
      console.log('ID do post a ser excluído:', postId);
      
      const postCheck = await pb.collection('posts').getOne(postId);

      console.log('Post encontrado:', postCheck);

      await pb.collection('posts').delete(postId);

      console.log('Post excluído com sucesso do banco de dados');
      console.log('=== EXCLUSÃO DE POST CONCLUÍDA ===');
      
      toast({
        title: "Post excluído!",
        description: "O post foi excluído permanentemente do banco de dados."
      });
    } catch (error) {
      console.error('=== ERRO NA EXCLUSÃO DE POST ===');
      console.error('Erro completo:', error);
      toast({
        title: "Erro",
        description: `Não foi possível excluir o post: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createPost,
    updatePost,
    deletePost
  };
};
