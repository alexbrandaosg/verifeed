
import { Post, PostFeedback } from '@/types/campaign';
import { parseDateFromDatabase } from '@/utils/dateUtils';

export const transformDatabasePostToPost = (data: any, feedbacks: PostFeedback[] = []): Post => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    images: data.images || [],
    status: data.status as 'pending' | 'approved' | 'revision_requested',
    feedback: data.feedback,
    feedbackImages: data.feedback_images || [],
    feedbacks,
    scheduledDate: data.scheduled_date ? parseDateFromDatabase(data.scheduled_date) : undefined,
    approvedAt: data.status === 'approved' ? new Date() : undefined,
    createdAt: new Date(data.created),
    updatedAt: new Date(data.updated)
  };
};

export const transformDatabaseFeedbackToPostFeedback = (feedback: any): PostFeedback => {
  return {
    id: feedback.id,
    feedbackText: feedback.feedback_text,
    feedbackImages: feedback.feedback_images || [],
    status: feedback.status as 'pending' | 'processed' | 'ignored',
    createdAt: new Date(feedback.created),
    processedAt: feedback.processed_at ? new Date(feedback.processed_at) : undefined
  };
};
