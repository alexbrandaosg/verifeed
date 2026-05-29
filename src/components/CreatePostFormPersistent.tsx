
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Post } from '@/types/campaign';
import { usePosts } from '@/hooks/usePosts';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import ImageUpload from './ImageUpload';
import { DatePicker } from './DatePicker';
import { Plus, Save, X, RotateCcw } from 'lucide-react';

interface CreatePostFormPersistentProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

interface PostFormData {
  title: string;
  description: string;
  images: string[];
  scheduledDate?: Date;
}

const CreatePostFormPersistent: React.FC<CreatePostFormPersistentProps> = ({
  campaignId,
  isOpen,
  onClose,
  onPostCreated
}) => {
  const { createPost, loading } = usePosts();
  const { toast } = useToast();
  
  const initialData: PostFormData = {
    title: '',
    description: '',
    images: [],
    scheduledDate: undefined
  };

  const {
    formData,
    updateFormData,
    resetForm,
    clearSavedData,
    lastSaved,
    isLoading: isPersistenceLoading
  } = useFormPersistence(`create_post_${campaignId}`, initialData);

  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      
      if (!formData.title.trim()) {
        toast({
          title: "Erro",
          description: "O título é obrigatório",
          variant: "destructive"
        });
        return;
      }

      if (!formData.description.trim()) {
        toast({
          title: "Erro",
          description: "A descrição é obrigatória",
          variant: "destructive"
        });
        return;
      }

      console.log('Criando novo post:', campaignId, formData);

      const newPost = await createPost(campaignId, {
        title: formData.title,
        description: formData.description,
        images: formData.images,
        status: 'pending',
        scheduledDate: formData.scheduledDate
      });

      if (newPost) {
        onPostCreated(newPost);
        resetForm(); // Limpar dados salvos após criação
        onClose();
      }
    } catch (error) {
      console.error('Erro ao criar post:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    // Manter dados salvos para próxima vez
    onClose();
  };

  const handleReset = () => {
    resetForm();
    toast({
      title: "Formulário limpo",
      description: "Os dados salvos foram removidos"
    });
  };

  const hasData = formData.title || formData.description || formData.images.length > 0;

  if (isPersistenceLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Carregando dados salvos...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Criar Novo Post</span>
            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-xs text-muted-foreground">
                  Salvo automaticamente às {lastSaved.toLocaleTimeString()}
                </span>
              )}
              {hasData && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs"
                  title="Limpar formulário"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Limpar
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {hasData && (
            <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              💾 Este formulário salva automaticamente seus dados. Você pode fechar e retornar depois.
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder="Digite o título do post"
              disabled={loading || isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Digite a descrição do post"
              rows={4}
              disabled={loading || isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label>Imagens e Vídeos</Label>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => updateFormData({ images })}
              maxImages={10}
              acceptVideo={true}
            />
          </div>

          <div className="space-y-2">
            <Label>Data de Agendamento (Opcional)</Label>
            <DatePicker
              date={formData.scheduledDate}
              onDateChange={(date) => updateFormData({ scheduledDate: date })}
              disabled={loading || isCreating}
            />
          </div>

          <div className="flex justify-between gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading || isCreating}
            >
              <X className="w-4 h-4 mr-2" />
              Fechar
            </Button>
            
            <Button
              onClick={handleCreate}
              disabled={loading || isCreating || !formData.title.trim() || !formData.description.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? 'Criando...' : 'Criar Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostFormPersistent;
