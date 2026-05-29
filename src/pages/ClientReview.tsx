
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import LoadingFallback from '@/components/LoadingFallback';
import FeedbackDialog from '@/components/FeedbackDialog';
import ClientReviewHeader from '@/components/client/ClientReviewHeader';
import ClientReviewError from '@/components/client/ClientReviewError';
import ClientReviewPosts from '@/components/client/ClientReviewPosts';
import { usePublicCampaign } from '@/hooks/usePublicCampaign';
import { useRobustLoading } from '@/hooks/useRobustLoading';
import { Campaign } from '@/types/campaign';
import { parseError, calculateStats } from '@/utils/clientReviewUtils';
import { useToast } from '@/hooks/use-toast';

interface ErrorInfo {
  type: string;
  message: string;
  details?: string;
}

const ClientReview = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const location = useLocation();
  const { updatePost, getCampaignById, addFeedback } = usePublicCampaign();
  const { toast } = useToast();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [feedbackDialog, setFeedbackDialog] = useState<{
    isOpen: boolean;
    postId: string;
    postTitle: string;
  }>({
    isOpen: false,
    postId: '',
    postTitle: ''
  });

  const {
    loading: pageLoading,
    error: loadingError,
    retryCount,
    execute,
    retry,
    reset,
    canRetry
  } = useRobustLoading({
    timeout: 30000,
    maxRetries: 3,
    onError: (err) => {
      console.error('Erro robusto no carregamento:', err);
      const parsedError = parseError(err);
      setError(parsedError);
    }
  });

  const loadCampaign = async (showToast = false) => {
    if (!campaignId) {
      console.error('❌ Campaign ID não encontrado na URL');
      setError({
        type: 'ID_INVALIDO',
        message: 'ID da campanha não encontrado na URL',
        details: 'A URL deve conter um ID de campanha válido'
      });
      return;
    }
    
    console.log('🚀 Iniciando carregamento da campanha:', campaignId);
    reset();
    setError(null);
    
    const result = await execute(async () => {
      const data = await getCampaignById(campaignId);
      
      if (!data) {
        throw new Error('CAMPANHA_NAO_ENCONTRADA: Nenhum dado retornado');
      }
      
      return data;
    });

    if (result) {
      setCampaign(result);
      console.log('✅ Campanha carregada com sucesso no componente');
      
      if (showToast) {
        toast({
          title: "Sucesso",
          description: "Campanha carregada com sucesso",
        });
      }
    }
  };

  useEffect(() => {
    console.log('=== CLIENT REVIEW USEEFFECT ===');
    console.log('Campaign ID from params:', campaignId);
    console.log('Location:', location.pathname);
    console.log('Full URL:', window.location.href);
    
    loadCampaign();
  }, [campaignId, location]);

  const handleRetry = async () => {
    console.log(`🔄 Tentativa de retry #${retryCount + 1}`);
    
    if (canRetry) {
      const result = await retry(() => getCampaignById(campaignId!));
      if (result) {
        setCampaign(result);
        setError(null);
        toast({
          title: "Sucesso",
          description: "Campanha carregada com sucesso",
        });
      }
    } else {
      loadCampaign(true);
    }
  };

  const handleApprove = async (postId: string) => {
    try {
      await updatePost(postId, { status: 'approved' });
      
      if (campaign) {
        const updatedPosts = campaign.posts.map(post =>
          post.id === postId ? { ...post, status: 'approved' as const } : post
        );
        setCampaign({ ...campaign, posts: updatedPosts });
      }

      toast({
        title: "Post aprovado!",
        description: "O post foi aprovado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao aprovar post:', error);
    }
  };

  const handleRequestRevision = (postId: string, postTitle: string) => {
    setFeedbackDialog({
      isOpen: true,
      postId,
      postTitle
    });
  };

  const handleFeedbackSubmit = async (feedback: string, images: string[]) => {
    try {
      // Adicionar novo feedback usando o sistema de múltiplos feedbacks
      const newFeedback = await addFeedback(feedbackDialog.postId, feedback, images);

      if (campaign) {
        const updatedPosts = campaign.posts.map(post => {
          if (post.id === feedbackDialog.postId) {
            return {
              ...post,
              status: 'revision_requested' as const,
              feedbacks: [newFeedback, ...post.feedbacks] // Adicionar no início (mais recente)
            };
          }
          return post;
        });
        setCampaign({ ...campaign, posts: updatedPosts });
      }

      toast({
        title: "Feedback enviado!",
        description: "Sua solicitação de alteração foi enviada para a agência."
      });
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
    }
  };

  const handleApproveAll = async () => {
    if (!campaign) return;

    try {
      const postsToApprove = campaign.posts.filter(post => post.status !== 'approved');
      
      await Promise.all(
        postsToApprove.map(post => updatePost(post.id, { status: 'approved' }))
      );

      const updatedPosts = campaign.posts.map(post => ({ ...post, status: 'approved' as const }));
      setCampaign({ ...campaign, posts: updatedPosts });

      toast({
        title: "Todos os posts aprovados!",
        description: `${postsToApprove.length} posts foram aprovados com sucesso.`
      });
    } catch (error) {
      console.error('Erro ao aprovar todos os posts:', error);
      toast({
        title: "Erro",
        description: "Não foi possível aprovar todos os posts",
        variant: "destructive"
      });
    }
  };

  if (pageLoading) {
    return (
      <LoadingFallback 
        message="Carregando campanha..."
        timeout={25000}
        onTimeout={() => {
          console.warn('Loading timeout atingido');
          setError({
            type: 'TIMEOUT',
            message: 'Timeout no carregamento',
            details: 'O carregamento demorou mais que o esperado'
          });
        }}
        onRetry={handleRetry}
        showRetry={canRetry}
      />
    );
  }

  if (error || loadingError || !campaign) {
    const currentError = error || parseError(loadingError);
    
    return (
      <ClientReviewError
        error={currentError}
        campaignId={campaignId}
        onRetry={handleRetry}
      />
    );
  }

  const stats = calculateStats(campaign.posts);
  const allApproved = stats.total > 0 && stats.approved === stats.total;

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientReviewHeader
        campaign={campaign}
        stats={stats}
        allApproved={allApproved}
        onApproveAll={handleApproveAll}
      />

      <div className="max-w-6xl mx-auto p-6">
        <ClientReviewPosts
          campaign={campaign}
          stats={stats}
          allApproved={allApproved}
          onApprove={handleApprove}
          onRequestRevision={handleRequestRevision}
          onApproveAll={handleApproveAll}
        />
      </div>

      <FeedbackDialog
        isOpen={feedbackDialog.isOpen}
        onOpenChange={(open) => setFeedbackDialog({ ...feedbackDialog, isOpen: open })}
        onSubmit={handleFeedbackSubmit}
        postTitle={feedbackDialog.postTitle}
      />
    </div>
  );
};

export default ClientReview;
