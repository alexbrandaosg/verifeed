
import React from 'react';
import FeedbackTimeline from './FeedbackTimeline';
import { Post } from '@/types/campaign';

interface PostFeedbackProps {
  post: Post;
  isAgencyView: boolean;
  hasBeenUpdatedAfterFeedback: boolean;
  onApprove?: (postId: string) => void;
}

const PostFeedback: React.FC<PostFeedbackProps> = ({
  post,
  isAgencyView,
  hasBeenUpdatedAfterFeedback,
  onApprove
}) => {
  // Verificar se existem feedbacks ou se o post foi aprovado
  const hasFeedbacks = post.feedbacks && post.feedbacks.length > 0;
  const isApproved = post.status === 'approved';
  
  // Só mostrar se há feedbacks OU se foi aprovado
  if (!hasFeedbacks && !isApproved) return null;

  return (
    <div className="space-y-4">
      <FeedbackTimeline post={post} />
    </div>
  );
};

export default PostFeedback;
