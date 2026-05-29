import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { pb } from '@/lib/pocketbase';
import { Upload, X, Image } from 'lucide-react';

interface FeedbackImageUploadProps {
  onImagesChange: (images: string[]) => void;
  currentImages?: string[];
}

const FeedbackImageUpload: React.FC<FeedbackImageUploadProps> = ({ 
  onImagesChange, 
  currentImages = [] 
}) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(currentImages);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive"
      });
      return null;
    }

    try {
      setUploading(true);
      console.log('Iniciando upload de imagem para feedback no PocketBase:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);

      const record = await pb.collection('uploads').create(formData);
      const publicUrl = pb.files.getURL(record, record.file);

      console.log('URL pública gerada:', publicUrl);
      
      return publicUrl;
    } catch (error) {
      console.error('Erro completo ao fazer upload:', error);
      
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da imagem",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    console.log('Arquivos selecionados:', files.length);

    const uploadPromises = Array.from(files).map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);
    
    const successfulUploads = results.filter(url => url !== null) as string[];
    
    if (successfulUploads.length > 0) {
      const newImages = [...images, ...successfulUploads];
      setImages(newImages);
      onImagesChange(newImages);
      
      toast({
        title: "Sucesso!",
        description: `${successfulUploads.length} imagem(ns) enviada(s) com sucesso.`
      });
    }

    // Limpar o input para permitir re-upload do mesmo arquivo
    event.target.value = '';
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    
    // Tentar remover do storage se for uma URL do PocketBase uploads
    if (imageUrl.includes('/api/files/')) {
      try {
        const urlParts = imageUrl.split('/');
        const recordId = urlParts[urlParts.length - 2];
        
        if (recordId) {
          await pb.collection('uploads').delete(recordId);
          console.log('Imagem removida do storage:', recordId);
        }
      } catch (error) {
        console.warn('Erro ao remover imagem do storage:', error);
        // Continuar mesmo se não conseguir remover do storage
      }
    }
    
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          className="relative"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Enviando...' : 'Adicionar Imagem'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            multiple
            disabled={uploading}
          />
        </Button>
        <span className="text-sm text-muted-foreground">Máximo 5MB por imagem</span>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Fazendo upload das imagens...
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Feedback ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
                onError={(e) => {
                  console.error('Erro ao carregar imagem:', image);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={() => removeImage(index)}
                disabled={uploading}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackImageUpload;
