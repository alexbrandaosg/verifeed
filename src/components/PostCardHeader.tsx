
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Post } from '@/types/campaign';
import { Edit, Trash2 } from 'lucide-react';
import PostStatusBadge from './PostStatusBadge';

interface PostCardHeaderProps {
  post: Post;
  isAgencyView: boolean;
  onEditClick: () => void;
  onDeletePost?: (postId: string) => void;
}

const PostCardHeader: React.FC<PostCardHeaderProps> = ({
  post,
  isAgencyView,
  onEditClick,
  onDeletePost
}) => {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <h3 className="text-lg font-semibold line-clamp-2 break-words hyphens-auto">
              {post.title}
            </h3>
          </TooltipTrigger>
          {post.title.length > 60 && (
            <TooltipContent>
              <p className="max-w-xs">{post.title}</p>
            </TooltipContent>
          )}
        </Tooltip>
        <PostStatusBadge status={post.status} />
      </div>
      
      {isAgencyView && (
        <div className="flex gap-1 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onEditClick}
            className="p-2"
            title="Editar post"
          >
            <Edit className="w-4 h-4" />
          </Button>
          {onDeletePost && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeletePost(post.id)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Excluir post"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCardHeader;
