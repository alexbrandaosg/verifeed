
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PostCardDescriptionProps {
  description: string;
}

const PostCardDescription: React.FC<PostCardDescriptionProps> = ({ description }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
        {showFullDescription ? description : truncateText(description, 200)}
      </p>
      {description.length > 200 && (
        <Button 
          variant="link" 
          className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? 'Ver menos' : 'Ver descrição completa'}
        </Button>
      )}
    </div>
  );
};

export default PostCardDescription;
