
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCampaignOperations } from './useCampaignOperations';
import { useCampaignLoader } from './useCampaignLoader';
import { useCampaignCache } from './useCampaignCache';

export const useCampaigns = () => {
  const { user } = useAuth();
  const { createCampaign, updateCampaign, deleteCampaign } = useCampaignOperations();
  const { loading, error, loadCampaigns } = useCampaignLoader();
  const {
    campaigns,
    shouldUseCache,
    updateCache,
    addCampaignToCache,
    removeCampaignFromCache,
    updateCampaignInCache,
    updateCampaignPosts,
    invalidateCache,
    handleCacheError
  } = useCampaignCache();

  const fetchCampaigns = async (useCache = true) => {
    try {
      if (shouldUseCache(useCache)) {
        console.log('Usando dados do cache');
        return;
      }

      const campaignsData = await loadCampaigns(useCache);
      updateCache(campaignsData);
    } catch (error) {
      handleCacheError();
    }
  };

  const handleCreateCampaign = async (campaignData: Parameters<typeof createCampaign>[0]) => {
    try {
      const newCampaign = await createCampaign(campaignData);
      addCampaignToCache(newCampaign);
      return newCampaign;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateCampaign = async (campaignId: string, updates: { title?: string; clientName?: string; description?: string }) => {
    try {
      await updateCampaign(campaignId, updates);
      
      // Atualizar o cache local
      updateCampaignInCache(campaignId, updates);
      
      // Recarregar campanhas para garantir consistência
      await fetchCampaigns(false);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteCampaign(campaignId);
      removeCampaignFromCache(campaignId);
    } catch (error) {
      throw error;
    }
  };

  const forceRefresh = () => {
    invalidateCache();
    fetchCampaigns(false);
  };

  useEffect(() => {
    if (user) {
      fetchCampaigns();
    } else {
      updateCache([]);
    }
  }, [user]);

  return {
    campaigns,
    loading,
    error,
    createCampaign: handleCreateCampaign,
    updateCampaign: handleUpdateCampaign,
    deleteCampaign: handleDeleteCampaign,
    updateCampaignPosts,
    refetchCampaigns: () => fetchCampaigns(false),
    forceRefresh
  };
};
