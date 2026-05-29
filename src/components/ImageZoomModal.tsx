
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ZoomIn } from 'lucide-react';

interface ImageZoomModalProps {
  imageSrc: string;
  imageAlt: string;
  children: React.ReactNode;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ imageSrc, imageAlt, children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          {children}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ZoomIn className="w-8 h-8 text-white" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="!fixed !inset-0 !max-w-none !max-h-none !h-screen !w-screen !p-0 !bg-black/95 !border-none !m-0 !transform-none !translate-x-0 !translate-y-0 !left-0 !top-0 !z-50 data-[state=open]:!animate-none">
        <div className="relative flex items-center justify-center h-full w-full" onClick={() => setOpen(false)}>
          {/* Close button - positioned absolutely and with higher z-index */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="absolute top-4 right-4 z-[60] bg-white hover:bg-gray-100 text-black border-none w-12 h-12 rounded-full shadow-lg"
            variant="outline"
            size="sm"
          >
            <X className="w-6 h-6" />
          </Button>
          
          {/* Image container - prevent click propagation to avoid closing when clicking image */}
          <div 
            className="flex items-center justify-center h-full w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className="max-h-full max-w-full object-contain"
              style={{
                maxHeight: 'calc(100vh - 2rem)',
                maxWidth: 'calc(100vw - 2rem)'
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageZoomModal;
