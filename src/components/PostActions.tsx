
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, MessageSquare, Clock } from 'lucide-react';
import { Post } from '@/types/campaign';

interface PostActionsProps {
  post: Post;
  showActions: boolean;
  isAgencyView: boolean;
  hasBeenUpdatedAfterFeedback: boolean;
  onApprove?: (postId: string) => void;
  onRequestRevision?: (postId: string) => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  post,
  showActions,
  isAgencyView,
  hasBeenUpdatedAfterFeedback,
  onApprove,
  onRequestRevision
}) => {
  // Para cliente: sempre mostrar ações se não for agência
  // Para agência: não mostrar ações
  if (!showActions || isAgencyView) return null;

  // Verificar se há feedbacks pendentes (aguardando processamento)
  const hasPendingFeedbacks = post.feedbacks?.some(f => f.status === 'pending') || false;

  // Cliente pode sempre aprovar ou solicitar alteração, MAS não quando há feedback pendente
  // E NÃO pode solicitar alteração quando o post já está aprovado
  const canApprove = (post.status === 'pending' || post.status === 'revision_requested') && !hasPendingFeedbacks;
  const canRequestRevision = post.status !== 'approved' && !hasPendingFeedbacks;

  // Se há feedback pendente, mostrar indicador
  if (hasPendingFeedbacks) {
    return (
      <div className="pt-4">
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Clock className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-yellow-700">
            Aguardando processamento da alteração solicitada
          </span>
        </div>
      </div>
    );
  }

  // Se o post está aprovado, não mostrar botões de ação
  if (post.status === 'approved') {
    return null;
  }

  if (!canApprove && !canRequestRevision) return null;

  return (
    <div className="flex gap-2 pt-4">
      {canApprove && (
        <Button
          onClick={() => onApprove?.(post.id)}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Check className="w-4 h-4 mr-2" />
          Aprovar
        </Button>
      )}
      
      {canRequestRevision && (
        <Button
          variant="outline"
          onClick={() => onRequestRevision?.(post.id)}
          className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {post.feedbacks && post.feedbacks.length > 0 ? 'Nova Alteração' : 'Solicitar Alteração'}
        </Button>
      )}
    </div>
  );
};

export default PostActions;
