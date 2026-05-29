
import { usePostOperations } from './usePostOperations';
import { usePostFeedbacks } from './usePostFeedbacks';
import { useCampaignData } from './useCampaignData';

export const usePosts = () => {
  const postOperations = usePostOperations();
  const feedbackOperations = usePostFeedbacks();
  const campaignData = useCampaignData();

  return {
    // Post operations
    loading: postOperations.loading || feedbackOperations.loading,
    createPost: postOperations.createPost,
    updatePost: postOperations.updatePost,
    deletePost: postOperations.deletePost,
    
    // Feedback operations
    addFeedback: feedbackOperations.addFeedback,
    markAllFeedbacksAsProcessed: feedbackOperations.markAllFeedbacksAsProcessed,
    getFeedbacksByPostId: feedbackOperations.getFeedbacksByPostId,
    
    // Campaign data
    getCampaignById: campaignData.getCampaignById
  };
};
