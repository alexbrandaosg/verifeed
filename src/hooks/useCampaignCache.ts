
import { useState, useCallback } from 'react';
import { Campaign, Post } from '@/types/campaign';

const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutos

export const useCampaignCache = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  const shouldUseCache = useCallback((useCache: boolean) => {
    if (!useCache) return false;
    if (!lastFetchTime) return false;
    
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime;
    
    return timeSinceLastFetch < CACHE_EXPIRY_TIME && campaigns.length > 0;
  }, [lastFetchTime, campaigns.length]);

  const updateCache = useCallback((newCampaigns: Campaign[]) => {
    console.log('Atualizando cache com', newCampaigns.length, 'campanhas');
    setCampaigns(newCampaigns);
    setLastFetchTime(Date.now());
  }, []);

  const addCampaignToCache = useCallback((newCampaign: Campaign) => {
    console.log('Adicionando campanha ao cache:', newCampaign.id);
    setCampaigns(prev => [newCampaign, ...prev]);
  }, []);

  const removeCampaignFromCache = useCallback((campaignId: string) => {
    console.log('Removendo campanha do cache:', campaignId);
    setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
  }, []);

  const updateCampaignInCache = useCallback((campaignId: string, updates: { title?: string; clientName?: string; description?: string }) => {
    console.log('Atualizando campanha no cache:', campaignId, updates);
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { 
            ...campaign, 
            title: updates.title ?? campaign.title,
            clientName: updates.clientName ?? campaign.clientName,
            description: updates.description ?? campaign.description,
            updatedAt: new Date()
          }
        : campaign
    ));
  }, []);

  const updateCampaignPosts = useCallback((campaignId: string, posts: Post[]) => {
    console.log('Atualizando posts da campanha no cache:', campaignId);
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId ? { ...campaign, posts } : campaign
    ));
  }, []);

  const invalidateCache = useCallback(() => {
    console.log('Invalidando cache');
    setLastFetchTime(null);
  }, []);

  const handleCacheError = useCallback(() => {
    console.log('Erro no cache, invalidando');
    invalidateCache();
  }, [invalidateCache]);

  return {
    campaigns,
    shouldUseCache,
    updateCache,
    addCampaignToCache,
    removeCampaignFromCache,
    updateCampaignInCache,
    updateCampaignPosts,
    invalidateCache,
    handleCacheError
  };
};
