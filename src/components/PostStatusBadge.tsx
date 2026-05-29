
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertCircle } from 'lucide-react';

interface PostStatusBadgeProps {
  status: 'pending' | 'approved' | 'revision_requested';
}

const PostStatusBadge: React.FC<PostStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'approved':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <Check className="w-3 h-3 mr-1" />
          Aprovado
        </Badge>
      );
    case 'revision_requested':
      return (
        <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" />
          Revisão Solicitada
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          Aguardando Aprovação
        </Badge>
      );
  }
};

export default PostStatusBadge;
