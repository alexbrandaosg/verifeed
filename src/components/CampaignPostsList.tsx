
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Post } from '@/types/campaign';
import { Calendar, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CampaignPostsListProps {
  posts: Post[];
  statusFilter: string;
}

const CampaignPostsList: React.FC<CampaignPostsListProps> = ({ posts, statusFilter }) => {
  const [showAll, setShowAll] = useState(false);
  
  const filteredPosts = statusFilter === 'all' 
    ? posts 
    : posts.filter(post => post.status === statusFilter);

  // Sort posts by creation date (newest first)
  const sortedPosts = filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const displayedPosts = showAll ? sortedPosts : sortedPosts.slice(0, 5);
  const hasMorePosts = sortedPosts.length > 5;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case 'revision_requested':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Revisão</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
    }
  };

  if (filteredPosts.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic bg-black text-white px-3 py-2 rounded-lg inline-block">
        {statusFilter === 'all' 
          ? 'Sem posts' 
          : `Nenhum post com status "${statusFilter === 'revision_requested' ? 'revisão solicitada' : statusFilter}"`
        }
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">
        Posts ({filteredPosts.length})
      </h4>
      <div className="space-y-2">
        {displayedPosts.map((post) => (
          <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{post.title}</span>
                {getStatusBadge(post.status)}
              </div>
              {post.scheduledDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {format(post.scheduledDate, "PPP", { locale: ptBR })}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {hasMorePosts && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-2"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Ver menos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Ver mais ({filteredPosts.length - 5} posts restantes)
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CampaignPostsList;
