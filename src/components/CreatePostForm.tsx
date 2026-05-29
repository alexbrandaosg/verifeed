
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ImageUpload from './ImageUpload';
import { DatePicker } from './DatePicker';
import { Post } from '@/types/campaign';
import { Plus, Save, X } from 'lucide-react';

interface CreatePostFormProps {
  onCreatePost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdatePost?: (postId: string, updates: Partial<Post>) => void;
  editingPost?: Post | null;
  onCancelEdit?: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ 
  onCreatePost, 
  onUpdatePost,
  editingPost,
  onCancelEdit
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();

  // Preencher o formulário quando estiver editando
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setDescription(editingPost.description);
      setImages(editingPost.images);
      setScheduledDate(editingPost.scheduledDate);
    } else {
      // Reset form quando não estiver editando
      setTitle('');
      setDescription('');
      setImages([]);
      setScheduledDate(undefined);
    }
  }, [editingPost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      return;
    }

    if (editingPost && onUpdatePost) {
      // Modo edição - só executa se realmente estiver editando
      console.log('Salvando post editado:', {
        postId: editingPost.id,
        title: title.trim(),
        description: description.trim(),
        images,
        scheduledDate
      });

      onUpdatePost(editingPost.id, {
        title: title.trim(),
        description: description.trim(),
        images,
        scheduledDate
      });

      // Cancelar edição após salvar
      onCancelEdit?.();
    } else if (!editingPost) {
      // Modo criação - incluir feedbacks como array vazio
      onCreatePost({
        title: title.trim(),
        description: description.trim(),
        images,
        scheduledDate,
        status: 'pending',
        feedbacks: [], // Adicionar feedbacks como array vazio
        feedback: undefined, // Campos deprecated mantidos para compatibilidade
        feedbackImages: undefined
      });

      // Reset form
      setTitle('');
      setDescription('');
      setImages([]);
      setScheduledDate(undefined);
    }
  };

  const handleCancel = () => {
    // Limpar formulário e cancelar edição sem salvar nada
    if (editingPost) {
      // Se estava editando, apenas cancela sem criar post
      onCancelEdit?.();
    } else {
      // Se estava criando, limpa o formulário
      setTitle('');
      setDescription('');
      setImages([]);
      setScheduledDate(undefined);
    }
  };

  return (
    <Card className="w-full rounded-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          {editingPost ? (
            <>
              <Save className="w-5 h-5 text-blue-600" />
              Editar Post
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Criar Novo Post
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Post</Label>
            <Input
              id="title"
              placeholder="Ex: Post para Instagram - Lançamento de produto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição/Legenda</Label>
            <Textarea
              id="description"
              placeholder="Digite a legenda do post aqui..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Data do Post</Label>
            <DatePicker
              date={scheduledDate}
              onDateChange={setScheduledDate}
              placeholder="Selecione a data de publicação"
            />
          </div>

          <div className="space-y-2">
            <Label>Imagens e Vídeos do Post</Label>
            {!editingPost && (
              <p className="text-sm text-muted-foreground">
                Aceita imagens (JPG, PNG) e vídeos MP4 até 30MB
              </p>
            )}
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={10}
              acceptVideo={true}
            />
          </div>

          <div className="flex gap-2 pt-2">
            {editingPost ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!title.trim() || !description.trim()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                  disabled={!title && !description && images.length === 0}
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={!title.trim() || !description.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Post
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
