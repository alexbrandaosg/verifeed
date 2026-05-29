import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Upload } from 'lucide-react';
import { pb } from '@/lib/pocketbase';
import { useToast } from '@/hooks/use-toast';
import MediaRenderer from './MediaRenderer';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  acceptVideo?: boolean;
  onImageRemoved?: (removedImageUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  acceptVideo = false,
  onImageRemoved
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File): Promise<string | null> => {
    const maxSize = acceptVideo ? 30 * 1024 * 1024 : 10 * 1024 * 1024;
    
    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: `O arquivo deve ter no máximo ${acceptVideo ? '30MB' : '10MB'}`,
        variant: "destructive"
      });
      return null;
    }

    const isValidFile = file.type.startsWith('image/') || 
      (acceptVideo && file.type === 'video/mp4');
    
    if (!isValidFile) {
      toast({
        title: "Tipo de arquivo não suportado",
        description: acceptVideo ? "Apenas imagens (PNG, JPG, JPEG) e vídeos MP4 são aceitos" : "Apenas imagens (PNG, JPG, JPEG) são aceitas",
        variant: "destructive"
      });
      return null;
    }

    try {
      console.log('Iniciando upload de arquivo para o PocketBase:', file.name, file.type);
      
      const formData = new FormData();
      formData.append('file', file);

      const record = await pb.collection('uploads').create(formData);
      
      // Construir a URL pública do arquivo
      const publicUrl = pb.files.getURL(record, record.file);

      console.log('Upload realizado com sucesso:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload do arquivo",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || uploading) return;
    
    setUploading(true);
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Math.min(files.length, remainingSlots);
    
    try {
      const uploadPromises = Array.from({ length: filesToProcess }, (_, i) => 
        uploadFile(files[i])
      );

      const results = await Promise.all(uploadPromises);
      const validResults = results.filter((result): result is string => result !== null);
      
      if (validResults.length > 0) {
        onImagesChange([...images, ...validResults]);
        toast({
          title: "Sucesso!",
          description: `${validResults.length} arquivo(s) enviado(s) com sucesso.`
        });
      }
    } catch (error) {
      console.error('Erro ao processar arquivos:', error);
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, acceptVideo, onImagesChange, uploading, toast]);

  const removeImage = useCallback((index: number) => {
    const imageUrl = images[index];
    const newImages = images.filter((_, i) => i !== index);
    
    // Atualizar estado local
    onImagesChange(newImages);
    
    // Notificar componente pai sobre a remoção (para cleanup posterior)
    if (onImageRemoved) {
      onImageRemoved(imageUrl);
    }
    
    console.log('Imagem removida localmente:', imageUrl);
  }, [images, onImagesChange, onImageRemoved]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const acceptFormats = acceptVideo ? "image/*,video/mp4" : "image/*";

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          type="file"
          multiple
          accept={acceptFormats}
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
          id="image-upload"
          disabled={images.length >= maxImages || uploading}
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {uploading 
                  ? 'Processando arquivos...'
                  : images.length >= maxImages 
                    ? `Máximo de ${maxImages} ${acceptVideo ? 'arquivos' : 'imagens'} atingido`
                    : `Clique para fazer upload ou arraste ${acceptVideo ? 'imagens/vídeos' : 'imagens'} aqui`
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {acceptVideo ? 'PNG, JPG, JPEG, MP4 (até 30MB)' : 'PNG, JPG, JPEG até 10MB'} ({images.length}/{maxImages})
              </p>
            </div>
          </div>
        </label>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Fazendo upload dos arquivos...
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <MediaRenderer
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-md"
                showControls={false}
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                disabled={uploading}
              >
                <X className="w-3 h-3" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
