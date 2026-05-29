
import React from 'react';
import { Calendar } from 'lucide-react';
import { Post } from '@/types/campaign';

interface PostCardFooterProps {
  post: Post;
  hasBeenUpdatedAfterFeedback: boolean;
}

const PostCardFooter: React.FC<PostCardFooterProps> = ({ 
  post, 
  hasBeenUpdatedAfterFeedback 
}) => {
  return (
    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <Calendar className="w-3 h-3" />
        <span>Criado: {post.createdAt.toLocaleDateString('pt-BR')}</span>
        {hasBeenUpdatedAfterFeedback && (
          <span>• Atualizado: {post.updatedAt.toLocaleDateString('pt-BR')}</span>
        )}
      </div>
    </div>
  );
};

export default PostCardFooter;
