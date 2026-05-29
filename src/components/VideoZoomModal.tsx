
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import MediaRenderer from './MediaRenderer';

interface VideoZoomModalProps {
  videoSrc: string;
  videoAlt?: string;
  children: React.ReactNode;
}

const VideoZoomModal: React.FC<VideoZoomModalProps> = ({
  videoSrc,
  videoAlt = 'Video',
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="!fixed !inset-0 !max-w-none !max-h-none !h-screen !w-screen !p-0 !bg-black/95 !border-none !m-0 !transform-none !translate-x-0 !translate-y-0 !left-0 !top-0 !z-50 data-[state=open]:!animate-none">
        <div className="relative flex items-center justify-center h-full w-full p-4">
          <MediaRenderer
            src={videoSrc}
            alt={videoAlt}
            className="max-w-full max-h-full object-contain"
            showControls={true}
            autoPlay={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoZoomModal;
