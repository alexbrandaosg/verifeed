
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PostCard from '@/components/PostCard';
import { Campaign } from '@/types/campaign';
import { MessageSquare, CheckCircle, Clock } from 'lucide-react';

interface ClientReviewPostsProps {
  campaign: Campaign;
  stats: {
    total: number;
    approved: number;
    pending: number;
    revision: number;
  };
  allApproved: boolean;
  onApprove: (postId: string) => void;
  onRequestRevision: (postId: string, postTitle: string) => void;
  onApproveAll: () => void;
}

const ClientReviewPosts: React.FC<ClientReviewPostsProps> = ({
  campaign,
  stats,
  allApproved,
  onApprove,
  onRequestRevision,
  onApproveAll
}) => {
  if (campaign.posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum post para revisar</h3>
        <p className="text-gray-500">A agência ainda não enviou posts para aprovação.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Posts para Aprovação
        </h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {stats.approved} Aprovados
          </Badge>
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            {stats.pending + stats.revision} Pendentes
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {campaign.posts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onApprove={onApprove}
            onRequestRevision={(postId) => onRequestRevision(postId, post.title)}
            showActions={true}
            isAgencyView={false}
          />
        ))}
      </div>

      {/* Botão Aprovar Todos no final da lista */}
      {!allApproved && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={onApproveAll}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            disabled={stats.approved === stats.total}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Aprovar Todos os Posts Restantes ({stats.total - stats.approved})
          </Button>
        </div>
      )}

      {/* Mensagem de agradecimento quando todos estão aprovados */}
      {allApproved && (
        <div className="text-center py-12 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-200">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-green-800 mb-4">Obrigado pela aprovação!</h3>
          <p className="text-lg text-green-700 mb-2">
            Todos os posts desta campanha foram aprovados com sucesso.
          </p>
          <p className="text-green-600">
            A agência foi notificada e os posts estão prontos para publicação nas redes sociais.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientReviewPosts;
