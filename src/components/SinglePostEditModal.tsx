
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Post } from '@/types/campaign';
import EditablePostForm from './EditablePostForm';
import { Calendar, Edit3 } from 'lucide-react';

interface SinglePostEditModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated: (updatedPost: Post) => void;
}

const SinglePostEditModal: React.FC<SinglePostEditModalProps> = ({
  post,
  isOpen,
  onClose,
  onPostUpdated
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-t-lg">
          <DialogTitle className="text-xl md:text-2xl text-white flex items-center gap-3">
            <Edit3 className="w-6 h-6" />
            Editar Post
          </DialogTitle>
          <div className="text-blue-100 text-sm space-y-1">
            <p className="font-medium">{post.title}</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Criado em: {post.createdAt.toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          <EditablePostForm
            post={post}
            isOpen={true}
            onClose={onClose}
            onPostUpdated={onPostUpdated}
            isFullScreen={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SinglePostEditModal;
