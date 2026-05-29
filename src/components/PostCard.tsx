
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { Post } from '@/types/campaign';
import PostCardHeader from './PostCardHeader';
import PostCardDescription from './PostCardDescription';
import PostCardMedia from './PostCardMedia';
import PostCardFooter from './PostCardFooter';
import PostScheduleInfo from './PostScheduleInfo';
import PostFeedback from './PostFeedback';
import PostActions from './PostActions';
import EditablePostForm from './EditablePostForm';
import SinglePostEditModal from './SinglePostEditModal';

interface PostCardProps {
  post: Post;
  onApprove?: (postId: string) => void;
  onRequestRevision?: (postId: string) => void;
  onUpdatePost?: (postId: string, updates: Partial<Post>) => void;
  onDeletePost?: (postId: string) => void;
  onEditPost?: (post: Post) => void;
  showActions?: boolean;
  isAgencyView?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onApprove, 
  onRequestRevision, 
  onUpdatePost,
  onDeletePost,
  onEditPost,
  showActions = true,
  isAgencyView = false 
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSingleEditModalOpen, setIsSingleEditModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
  const isMobile = useIsMobile();

  const hasBeenUpdatedAfterFeedback = () => {
    return currentPost.feedback && currentPost.updatedAt > currentPost.createdAt;
  };

  const handleEditClick = () => {
    // Always open SinglePostEditModal for agency view
    setIsSingleEditModalOpen(true);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    console.log('Post atualizado no card:', updatedPost);
    setCurrentPost(updatedPost);
    
    if (onUpdatePost) {
      onUpdatePost(updatedPost.id, updatedPost);
    }
  };

  return (
    <TooltipProvider>
      <Card className="w-full hover:shadow-md transition-all duration-200 rounded-lg border border-gray-200">
        <CardContent className="p-0">
          <div className={`${isMobile ? 'flex flex-col' : 'flex'} min-h-[200px]`}>
            {/* Content Section */}
            <div className={`${isMobile ? 'w-full' : 'flex-1'} p-6 space-y-4`}>
              {/* Header: Title + Status + Actions */}
              <PostCardHeader
                post={currentPost}
                isAgencyView={isAgencyView}
                onEditClick={handleEditClick}
                onDeletePost={onDeletePost}
              />

              {/* Description */}
              <PostCardDescription description={currentPost.description} />

              {/* Schedule Info */}
              <PostScheduleInfo scheduledDate={currentPost.scheduledDate} />

              {/* Feedback Section */}
              <PostFeedback 
                post={currentPost}
                isAgencyView={isAgencyView}
                hasBeenUpdatedAfterFeedback={hasBeenUpdatedAfterFeedback()}
                onApprove={onApprove}
              />

              {/* Actions */}
              <PostActions
                post={currentPost}
                showActions={showActions}
                isAgencyView={isAgencyView}
                hasBeenUpdatedAfterFeedback={hasBeenUpdatedAfterFeedback()}
                onApprove={onApprove}
                onRequestRevision={onRequestRevision}
              />

              {/* Footer */}
              <PostCardFooter
                post={currentPost}
                hasBeenUpdatedAfterFeedback={hasBeenUpdatedAfterFeedback()}
              />
            </div>

            {/* Media Section */}
            <div className={`${isMobile ? 'w-full border-t' : 'w-80 border-l'} bg-gray-50 border-gray-200 p-4 flex flex-col`}>
              <PostCardMedia images={currentPost.images} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <EditablePostForm
        post={currentPost}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onPostUpdated={handlePostUpdated}
      />

      <SinglePostEditModal
        post={currentPost}
        isOpen={isSingleEditModalOpen}
        onClose={() => setIsSingleEditModalOpen(false)}
        onPostUpdated={handlePostUpdated}
      />
    </TooltipProvider>
  );
};

export default PostCard;
