
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Images, Play } from 'lucide-react';
import MediaRenderer from './MediaRenderer';
import VideoZoomModal from './VideoZoomModal';
import ImageZoomModal from './ImageZoomModal';
interface PostCardMediaProps {
  images: string[];
}
const PostCardMedia: React.FC<PostCardMediaProps> = ({
  images
}) => {
  const isVideo = (src: string) => {
    return src.toLowerCase().includes('.mp4') || src.toLowerCase().includes('video') || src.startsWith('data:video/');
  };
  if (images.length === 0) {
    return <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-400">
          <Images className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Sem mídia</p>
        </div>
      </div>;
  }

  // Determinar o layout do grid baseado na quantidade de mídias
  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  // Determinar a altura baseada na quantidade de mídias
  const getItemHeight = (count: number) => {
    if (count === 1) return 'aspect-[3/4]';
    if (count === 2) return 'aspect-square';
    return 'aspect-square';
  };
  return <div className="space-y-3">
      {/* Grid de todas as mídias */}
      <div className={`grid ${getGridCols(images.length)} gap-2`}>
        {images.map((url, index) => {
        const itemHeight = getItemHeight(images.length);
        const mediaElement = <div className="relative group cursor-pointer hover:opacity-90 transition-all duration-200">
              <MediaRenderer key={index} src={url} alt={`Post media ${index + 1}`} className={`w-full ${itemHeight} object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow`} showControls={false} />
              
              {/* Indicador de tipo de mídia */}
              <div className="absolute top-2 left-2 z-[5]">
                {isVideo(url) ? <Badge className="bg-black/80 text-white text-xs px-2 py-1 flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    Vídeo
                  </Badge> : <Badge className="bg-black/80 text-white text-xs px-2 py-1 flex items-center gap-1">
                    <Images className="w-3 h-3" />
                    Imagem
                  </Badge>}
              </div>

              {/* Overlay de hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {isVideo(url) ? <Play className="w-8 h-8 text-white drop-shadow-lg" /> : <Images className="w-8 h-8 text-white drop-shadow-lg" />}
                </div>
              </div>
            </div>;

        // Envolver com o modal apropriado
        if (isVideo(url)) {
          return <VideoZoomModal key={index} videoSrc={url} videoAlt={`Post video ${index + 1}`}>
                {mediaElement}
              </VideoZoomModal>;
        }
        return <ImageZoomModal key={index} imageSrc={url} imageAlt={`Post image ${index + 1}`}>
              {mediaElement}
            </ImageZoomModal>;
      })}
      </div>

      {/* Contador de mídias (apenas informativo) */}
      {images.length > 1 && <div className="text-center">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {images.length} {images.length === 1 ? 'mídia' : 'mídias'}
          </span>
        </div>}
    </div>;
};
export default PostCardMedia;
