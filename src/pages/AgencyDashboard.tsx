import React, { useState } from 'react';
import CampaignFilters from '@/components/CampaignFilters';
import CreatePostFormPersistent from '@/components/CreatePostFormPersistent';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CreateCampaignModal from '@/components/dashboard/CreateCampaignModal';
import CampaignCard from '@/components/dashboard/CampaignCard';
import CampaignManagementModal from '@/components/dashboard/CampaignManagementModal';
import EmptyState from '@/components/dashboard/EmptyState';
import { useCampaigns } from '@/hooks/useCampaigns';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';
import { Post, Campaign } from '@/types/campaign';
import { useToast } from '@/hooks/use-toast';

const AgencyDashboard = () => {
  const { campaigns, loading, createCampaign, updateCampaign, deleteCampaign, refetchCampaigns } = useCampaigns();
  const { updatePost, deletePost } = usePosts();
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  
  const [newCampaignOpen, setNewCampaignOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [campaignData, setCampaignData] = useState({
    title: '',
    description: '',
    clientName: ''
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso"
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignData.title.trim() || !campaignData.clientName.trim()) {
      return;
    }

    try {
      const newCampaign = await createCampaign({
        title: campaignData.title.trim(),
        description: campaignData.description.trim(),
        clientName: campaignData.clientName.trim()
      });

      setCampaignData({ title: '', description: '', clientName: '' });
      setNewCampaignOpen(false);
      
      console.log('Nova campanha criada, selecionando:', newCampaign);
      setSelectedCampaign(newCampaign);
      
      toast({
        title: "Campanha criada!",
        description: "A nova campanha foi criada com sucesso."
      });
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      console.log('Iniciando exclusão da campanha:', campaignId);
      await deleteCampaign(campaignId);
      console.log('Campanha excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir campanha:', error);
    }
  };

  const handlePostCreated = async (post: Post) => {
    console.log('=== POST CRIADO COM SUCESSO ===');
    console.log('Novo post:', post);
    
    if (selectedCampaign) {
      setSelectedCampaign(prev => {
        if (!prev) return null;
        const updatedCampaign = {
          ...prev,
          posts: [...prev.posts, post]
        };
        console.log('Campanha atualizada com novo post:', updatedCampaign);
        return updatedCampaign;
      });
    }
    
    await refetchCampaigns();
    setCreatePostOpen(false);
    
    toast({
      title: "Post criado!",
      description: "O post foi criado com sucesso e os dados foram salvos."
    });
    
    console.log('=== CRIAÇÃO DE POST CONCLUÍDA ===');
  };

  const handleUpdatePost = async (postId: string, updates: Partial<Post>) => {
    try {
      console.log('Atualizando post:', postId, 'com dados:', updates);
      
      await updatePost(postId, updates);
      
      if (selectedCampaign) {
        setSelectedCampaign(prev => {
          if (!prev) return null;
          return {
            ...prev,
            posts: prev.posts.map(post => 
              post.id === postId ? { ...post, ...updates } : post
            )
          };
        });
      }
      
      await refetchCampaigns();
      
      toast({
        title: "Post atualizado!",
        description: "As alterações foram salvas com sucesso."
      });
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      console.log('Excluindo post:', postId);
      await deletePost(postId);
      
      if (selectedCampaign) {
        setSelectedCampaign(prev => {
          if (!prev) return null;
          return {
            ...prev,
            posts: prev.posts.filter(post => post.id !== postId)
          };
        });
      }
      
      await refetchCampaigns();
      
      console.log('Post excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir post:', error);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setTimeout(() => {
      const modalContent = document.querySelector('[data-radix-dialog-content]') ||
                          document.querySelector('.max-w-6xl.max-h-\\[90vh\\].overflow-y-auto') ||
                          document.querySelector('[role="dialog"]');
      
      if (modalContent) {
        modalContent.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 150);
  };

  const copyShareLink = (shareLink: string) => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copiado!",
      description: "O link de aprovação foi copiado para a área de transferência."
    });
  };

  const handleSelectCampaign = (campaign: Campaign) => {
    console.log('=== SELECIONANDO CAMPANHA ===');
    console.log('Campanha selecionada:', campaign);
    console.log('ID da campanha:', campaign.id);
    console.log('Posts da campanha:', campaign.posts);
    
    setSelectedCampaign(campaign);
    
    setTimeout(() => {
      console.log('selectedCampaign após setState:', selectedCampaign);
    }, 100);
  };

  const handleUpdateCampaign = async (campaignId: string, updates: { title?: string; clientName?: string; description?: string }) => {
    try {
      console.log('Atualizando informações da campanha:', campaignId, 'com dados:', updates);
      
      await updateCampaign(campaignId, updates);
      
      // Atualizar a campanha selecionada se for a mesma
      if (selectedCampaign && selectedCampaign.id === campaignId) {
        setSelectedCampaign(prev => {
          if (!prev) return null;
          return {
            ...prev,
            title: updates.title ?? prev.title,
            clientName: updates.clientName ?? prev.clientName,
            description: updates.description ?? prev.description,
            updatedAt: new Date()
          };
        });
      }
      
      toast({
        title: "Campanha atualizada!",
        description: "As informações da campanha foram atualizadas com sucesso."
      });
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesClient = campaign.clientName ? 
      campaign.clientName.toLowerCase().includes(clientFilter.toLowerCase()) : 
      true;
    const matchesStatus = statusFilter === 'all' || campaign.posts.some(post => post.status === statusFilter);
    return matchesClient && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Carregando campanhas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <DashboardHeader
          username={profile?.username}
          onCreateCampaign={() => setNewCampaignOpen(true)}
          onSignOut={handleSignOut}
        />

        <CreateCampaignModal
          isOpen={newCampaignOpen}
          onOpenChange={setNewCampaignOpen}
          campaignData={campaignData}
          onCampaignDataChange={setCampaignData}
          onSubmit={handleCreateCampaign}
        />

        <CampaignFilters
          statusFilter={statusFilter}
          clientFilter={clientFilter}
          onStatusFilterChange={setStatusFilter}
          onClientFilterChange={setClientFilter}
        />

        {/* Campaigns List */}
        <div className="space-y-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              statusFilter={statusFilter}
              onCopyShareLink={copyShareLink}
              onDeleteCampaign={handleDeleteCampaign}
              onSelectCampaign={handleSelectCampaign}
            />
          ))}
        </div>

        {filteredCampaigns.length === 0 && <EmptyState />}

        <CampaignManagementModal
          campaign={selectedCampaign}
          isOpen={!!selectedCampaign}
          onClose={() => {
            console.log('Fechando modal, limpando selectedCampaign');
            setSelectedCampaign(null);
            setEditingPost(null);
            setCreatePostOpen(false);
          }}
          onCreatePost={() => setCreatePostOpen(true)}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
          onEditPost={handleEditPost}
          onUpdateCampaign={handleUpdateCampaign}
        />

        {/* Create Post Modal with Persistence */}
        {selectedCampaign && (
          <CreatePostFormPersistent
            campaignId={selectedCampaign.id}
            isOpen={createPostOpen}
            onClose={() => setCreatePostOpen(false)}
            onPostCreated={handlePostCreated}
          />
        )}
      </div>
    </div>
  );
};

export default AgencyDashboard;
