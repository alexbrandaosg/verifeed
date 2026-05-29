import React, { useState, useEffect } from 'react';
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
import { Save, X } from 'lucide-react';
import { pb } from '@/lib/pocketbase';

interface EditablePostFormProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated: (updatedPost: Post) => void;
  isFullScreen?: boolean;
}

interface PostFormData {
  title: string;
  description: string;
  images: string[];
  scheduledDate?: Date;
}

const EditablePostForm: React.FC<EditablePostFormProps> = ({
  post,
  isOpen,
  onClose,
  onPostUpdated,
  isFullScreen = false
}) => {
  const { updatePost, loading } = usePosts();
  const { toast } = useToast();
  
  const initialData: PostFormData = {
    title: post.title,
    description: post.description,
    images: post.images,
    scheduledDate: post.scheduledDate
  };

  const {
    formData: rawFormData,
    updateFormData,
    clearSavedData,
    lastSaved
  } = useFormPersistence(`edit_post_${post.id}`, initialData);

  // Estado para rastrear imagens removidas (para cleanup posterior)
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  // Função helper para converter string em Date se necessário
  const ensureDate = (date: any): Date | undefined => {
    if (!date) return undefined;
    if (date instanceof Date) return date;
    if (typeof date === 'string') return new Date(date);
    return undefined;
  };

  // Garantir que scheduledDate seja sempre um Date quando existir
  const formData: PostFormData = {
    ...rawFormData,
    scheduledDate: ensureDate(rawFormData.scheduledDate)
  };

  const [isSaving, setIsSaving] = useState(false);

  // Resetar formulário quando o post muda
  useEffect(() => {
    if (isOpen) {
      updateFormData({
        title: post.title,
        description: post.description,
        images: post.images,
        scheduledDate: post.scheduledDate
      });
      setRemovedImages([]); // Limpar lista de imagens removidas
    }
  }, [post, isOpen]);

  // Função para fazer cleanup de imagens removidas do storage
  const cleanupRemovedImages = async (imagesToRemove: string[]) => {
    const cleanupPromises = imagesToRemove.map(async (imageUrl) => {
      // Remover imagem se for uma URL do PocketBase uploads
      if (imageUrl.includes('/api/files/')) {
        try {
          const urlParts = imageUrl.split('/');
          // A URL do PocketBase é /api/files/COLLECTION_ID/RECORD_ID/FILENAME
          const recordId = urlParts[urlParts.length - 2];
          
          if (recordId) {
            await pb.collection('uploads').delete(recordId);
            console.log('Arquivo removido do storage (PocketBase):', recordId);
          }
        } catch (error) {
          console.warn('Erro ao remover arquivo do storage:', error);
        }
      }
    });

    await Promise.all(cleanupPromises);
  };

  const handleImageRemoved = (removedImageUrl: string) => {
    // Adicionar à lista de imagens removidas apenas se era uma imagem original do post
    if (post.images.includes(removedImageUrl)) {
      setRemovedImages(prev => [...prev, removedImageUrl]);
      console.log('Imagem marcada para remoção:', removedImageUrl);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
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

      console.log('Salvando alterações do post:', post.id, formData);
      console.log('Imagens a serem removidas do storage:', removedImages);

      const updatedPost = await updatePost(post.id, {
        title: formData.title,
        description: formData.description,
        images: formData.images,
        scheduledDate: formData.scheduledDate
      });

      if (updatedPost) {
        // Fazer cleanup das imagens removidas do storage apenas após salvar com sucesso
        if (removedImages.length > 0) {
          await cleanupRemovedImages(removedImages);
          console.log('Cleanup de imagens removidas concluído');
        }

        onPostUpdated(updatedPost);
        clearSavedData();
        setRemovedImages([]); // Limpar lista após sucesso
        onClose();
      }
    } catch (error) {
      console.error('Erro ao salvar post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Manter dados salvos para próxima vez, mas limpar lista de remoções
    setRemovedImages([]);
    onClose();
  };

  // Comparação segura de datas
  const getDateTimestamp = (date: Date | undefined): number | undefined => {
    return date instanceof Date ? date.getTime() : undefined;
  };

  const hasChanges = 
    formData.title !== post.title ||
    formData.description !== post.description ||
    JSON.stringify(formData.images) !== JSON.stringify(post.images) ||
    getDateTimestamp(formData.scheduledDate) !== getDateTimestamp(post.scheduledDate);

  // Se for fullscreen, renderizar apenas o conteúdo do formulário
  if (isFullScreen) {
    return (
      <div className="space-y-6">
        {lastSaved && (
          <div className="text-xs text-muted-foreground text-right">
            Salvo automaticamente às {lastSaved.toLocaleTimeString()}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="Digite o título do post"
            disabled={loading || isSaving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Digite a descrição do post"
            rows={6}
            disabled={loading || isSaving}
          />
        </div>

        <div className="space-y-2">
          <Label>Imagens e Vídeos</Label>
          <ImageUpload
            images={formData.images}
            onImagesChange={(images) => updateFormData({ images })}
            onImageRemoved={handleImageRemoved}
            maxImages={10}
            acceptVideo={true}
          />
        </div>

        <div className="space-y-2">
          <Label>Data de Agendamento (Opcional)</Label>
          <DatePicker
            date={formData.scheduledDate}
            onDateChange={(date) => updateFormData({ scheduledDate: date })}
            disabled={loading || isSaving}
          />
        </div>

        <div className="flex justify-between gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading || isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            Fechar
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={loading || isSaving || !hasChanges}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>

        {hasChanges && (
          <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
            ⚠️ Você tem alterações não salvas. Clique em "Salvar Alterações" para aplicá-las.
          </div>
        )}

        {removedImages.length > 0 && (
          <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
            ℹ️ {removedImages.length} imagem(ns) será(ão) removida(s) permanentemente ao salvar.
          </div>
        )}
      </div>
    );
  }

  // Modal mode (existing functionality)
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Editar Post</span>
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                Salvo automaticamente às {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder="Digite o título do post"
              disabled={loading || isSaving}
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
              disabled={loading || isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label>Imagens e Vídeos</Label>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => updateFormData({ images })}
              onImageRemoved={handleImageRemoved}
              maxImages={10}
              acceptVideo={true}
            />
          </div>

          <div className="space-y-2">
            <Label>Data de Agendamento (Opcional)</Label>
            <DatePicker
              date={formData.scheduledDate}
              onDateChange={(date) => updateFormData({ scheduledDate: date })}
              disabled={loading || isSaving}
            />
          </div>

          <div className="flex justify-between gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading || isSaving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={loading || isSaving || !hasChanges}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>

          {hasChanges && (
            <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
              ⚠️ Você tem alterações não salvas. Clique em "Salvar Alterações" para aplicá-las.
            </div>
          )}

          {removedImages.length > 0 && (
            <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              ℹ️ {removedImages.length} imagem(ns) será(ão) removida(s) permanentemente ao salvar.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditablePostForm;
