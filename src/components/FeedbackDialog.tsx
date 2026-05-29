
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import FeedbackImageUpload from './FeedbackImageUpload';
import { MessageSquare, Send } from 'lucide-react';

interface FeedbackDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: string, images: string[]) => void;
  postTitle: string;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  postTitle
}) => {
  const [feedback, setFeedback] = useState('');
  const [feedbackImages, setFeedbackImages] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    
    onSubmit(feedback, feedbackImages);
    setFeedback('');
    setFeedbackImages([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            Solicitar Alteração
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Post: <span className="font-medium">{postTitle}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Descreva as alterações necessárias *</Label>
            <Textarea
              id="feedback"
              placeholder="Explique quais mudanças você gostaria de ver neste post..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Imagens de Referência (opcional)</Label>
            <FeedbackImageUpload 
              onImagesChange={setFeedbackImages}
              currentImages={feedbackImages}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!feedback.trim()}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
