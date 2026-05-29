import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import ImageZoomModal from './ImageZoomModal';

interface MediaRendererProps {
  src: string;
  alt?: string;
  className?: string;
  showControls?: boolean;
  autoPlay?: boolean;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ 
  src, 
  alt, 
  className = "w-full h-64 object-contain bg-gray-50 rounded-lg border",
  showControls = true,
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isVideo = src.toLowerCase().includes('.mp4') || 
                 src.toLowerCase().includes('video') || 
                 src.startsWith('data:video/');

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const video = videoRef.current;
    
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Fullscreen change event listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isVideo]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Erro ao alternar tela cheia:', error);
    }
  };

  if (!isVideo) {
    return (
      <ImageZoomModal imageSrc={src} imageAlt={alt || 'Image'}>
        <div className="relative">
          <img
            src={src}
            alt={alt}
            className={`${className} transition-transform duration-200 hover:scale-[1.02] cursor-pointer`}
            loading="lazy"
          />
        </div>
      </ImageZoomModal>
    );
  }

  if (hasError) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 text-gray-500`}>
        <div className="text-center">
          <Play className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Erro ao carregar vídeo</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`relative group ${isFullscreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center' : ''}`}
    >
      <video
        ref={videoRef}
        src={src}
        className={isFullscreen ? 'w-screen h-screen object-contain' : className}
        muted={isMuted}
        playsInline
        preload="metadata"
        poster={undefined}
      >
        Seu navegador não suporta o elemento de vídeo.
      </video>

      {/* Loading indicator */}
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center ${isFullscreen ? 'bg-black' : 'bg-gray-100 rounded-lg'}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Video type indicator */}
      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
        <Play className="w-3 h-3" />
        Vídeo
      </div>

      {/* Controls */}
      {showControls && !isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isFullscreen ? 'bg-black/40' : 'bg-black/20 rounded-lg'}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="bg-black/70 text-white p-3 rounded-full hover:bg-black/80 transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            
            <button
              onClick={toggleMute}
              className="bg-black/70 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="bg-black/70 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
              title="Tela cheia"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaRenderer;
