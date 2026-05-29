
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Campaign, Post } from '@/types/campaign';
import { Plus, Calendar, CheckCircle, Filter, Edit, Check, X } from 'lucide-react';
import PostCard from '@/components/PostCard';

interface CampaignManagementModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: () => void;
  onUpdatePost: (postId: string, updates: Partial<Post>) => void;
  onDeletePost: (postId: string) => void;
  onEditPost: (post: Post) => void;
  onUpdateCampaign?: (campaignId: string, updates: { title?: string; clientName?: string; description?: string }) => void;
}

const CampaignManagementModal: React.FC<CampaignManagementModalProps> = ({
  campaign,
  isOpen,
  onClose,
  onCreatePost,
  onUpdatePost,
  onDeletePost,
  onEditPost,
  onUpdateCampaign
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'revision_requested'>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedClientName, setEditedClientName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  if (!campaign) return null;

  const handleEditStart = () => {
    setEditedTitle(campaign.title);
    setEditedClientName(campaign.clientName);
    setEditedDescription(campaign.description);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedTitle('');
    setEditedClientName('');
    setEditedDescription('');
  };

  const handleEditSave = () => {
    if (!onUpdateCampaign) return;
    
    const updates: { title?: string; clientName?: string; description?: string } = {};
    
    if (editedTitle.trim() !== campaign.title) {
      updates.title = editedTitle.trim();
    }
    if (editedClientName.trim() !== campaign.clientName) {
      updates.clientName = editedClientName.trim();
    }
    if (editedDescription.trim() !== campaign.description) {
      updates.description = editedDescription.trim();
    }
    
    if (Object.keys(updates).length > 0) {
      onUpdateCampaign(campaign.id, updates);
    }
    
    setIsEditing(false);
  };

  const getCampaignStats = (campaign: Campaign) => {
    const total = campaign.posts.length;
    const approved = campaign.posts.filter(p => p.status === 'approved').length;
    const pending = campaign.posts.filter(p => p.status === 'pending').length;
    const revision = campaign.posts.filter(p => p.status === 'revision_requested').length;
    return { total, approved, pending, revision };
  };

  const stats = getCampaignStats(campaign);
  const allApproved = stats.total > 0 && stats.approved === stats.total;
  const progressPercentage = stats.total > 0 ? (stats.approved / stats.total) * 100 : 0;

  const filteredPosts = campaign.posts.filter(post => 
    statusFilter === 'all' || post.status === statusFilter
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto rounded-xl mx-4 border-none p-0">
        {/* Header Sticky */}
        <div className="sticky top-0 z-10 bg-white">
          <DialogHeader className={`${allApproved ? 'bg-gradient-to-r from-green-500 to-green-700' : 'bg-gradient-to-r from-blue-500 to-blue-700'} text-white p-6 rounded-t-xl`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-1">Título da Campanha</label>
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-blue-200"
                        placeholder="Título da campanha"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-1">Nome do Cliente</label>
                      <Input
                        value={editedClientName}
                        onChange={(e) => setEditedClientName(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-blue-200"
                        placeholder="Nome do cliente"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-1">Descrição</label>
                      <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-blue-200 min-h-[60px]"
                        placeholder="Descrição da campanha"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleEditSave}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Salvar
                      </Button>
                      <Button
                        onClick={handleEditCancel}
                        size="sm"
                        variant="ghost"
                        className="text-white hover:text-red-100 hover:bg-red-500/20"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <DialogTitle className="text-xl md:text-2xl text-white flex items-center gap-2">
                      Gerenciar: {campaign.title}
                      {allApproved && (
                        <CheckCircle className="w-5 md:w-6 h-5 md:h-6 text-green-200" />
                      )}
                    </DialogTitle>
                    <p className="text-blue-100">Cliente: {campaign.clientName}</p>
                    {campaign.description && (
                      <p className="text-blue-100 text-sm mt-1">{campaign.description}</p>
                    )}
                    <p className="text-blue-100 text-sm">ID: {campaign.id}</p>
                  </div>
                )}
              </div>
              
              {!isEditing && onUpdateCampaign && (
                <Button
                  onClick={handleEditStart}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-blue-100 hover:bg-white/20 ml-4"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              )}
            </div>
            
            {!isEditing && (
              <>
                {/* Progress Bar */}
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm text-blue-100">
                    <span>Progresso da Aprovação</span>
                    <span>{stats.approved}/{stats.total} posts aprovados</span>
                  </div>
                  <div className="w-full bg-blue-200/30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {allApproved && (
                  <div className="mt-2 p-3 bg-green-100/20 rounded-lg">
                    <p className="text-green-100 font-medium">🎉 Parabéns! Todos os posts desta campanha foram aprovados pelo cliente!</p>
                  </div>
                )}
              </>
            )}
          </DialogHeader>

          {/* Action Bar */}
          <div className="bg-white border-b p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={onCreatePost}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Novo Post
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <div className="flex gap-1">
                {(['all', 'pending', 'approved', 'revision_requested'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={statusFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(filter)}
                    className="text-xs"
                  >
                    {filter === 'all' && `Todos (${stats.total})`}
                    {filter === 'pending' && `Pendentes (${stats.pending})`}
                    {filter === 'approved' && `Aprovados (${stats.approved})`}
                    {filter === 'revision_requested' && `Revisão (${stats.revision})`}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Posts List - One post per line */}
        <div className="space-y-6 p-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                {statusFilter === 'all' 
                  ? 'Nenhum post criado ainda'
                  : `Nenhum post ${statusFilter === 'pending' ? 'pendente' : statusFilter === 'approved' ? 'aprovado' : 'em revisão'} encontrado`
                }
              </p>
              <p className="text-sm text-gray-500">
                {statusFilter === 'all' && 'Clique em "Criar Novo Post" para começar'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isAgencyView={true}
                  showActions={false}
                  onUpdatePost={onUpdatePost}
                  onDeletePost={onDeletePost}
                  onEditPost={onEditPost}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignManagementModal;
