
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Image, Clock, CheckCircle } from 'lucide-react';
import { PostFeedback, Post } from '@/types/campaign';
import ImageZoomModal from './ImageZoomModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeedbackTimelineProps {
  post: Post;
}

const FeedbackTimeline: React.FC<FeedbackTimelineProps> = ({ post }) => {
  const { feedbacks } = post;
  
  // Criar array com feedbacks e evento de aprovação (se existir)
  const timelineItems = [];
  
  // Adicionar feedbacks
  if (feedbacks && feedbacks.length > 0) {
    timelineItems.push(...feedbacks.map(feedback => ({
      type: 'feedback' as const,
      data: feedback,
      date: feedback.createdAt
    })));
  }
  
  // Adicionar evento de aprovação se o post está aprovado
  if (post.status === 'approved' && post.approvedAt) {
    timelineItems.push({
      type: 'approval' as const,
      data: {
        approvedAt: post.approvedAt
      },
      date: post.approvedAt
    });
  }
  
  // Ordenar por data (mais recente primeiro)
  timelineItems.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  if (timelineItems.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1">
        <MessageSquare className="w-4 h-4" />
        Histórico:
      </h4>
      
      <div className="space-y-4">
        {timelineItems.map((item, index) => (
          <div key={index}>
            {item.type === 'feedback' ? (
              <div className={`relative border-l-4 pl-4 pb-4 ${
                item.data.status === 'processed' 
                  ? 'border-gray-300 opacity-70' 
                  : 'border-orange-400'
              }`}>
                {/* Timeline dot */}
                <div className={`absolute -left-2 w-3 h-3 rounded-full ${
                  item.data.status === 'processed' 
                    ? 'bg-gray-400' 
                    : 'bg-orange-400'
                }`} />
                
                {/* Feedback header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={item.data.status === 'processed' ? 'secondary' : 'default'}
                      className={item.data.status === 'processed' ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-700'}
                    >
                      {item.data.status === 'processed' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Processado
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Pendente
                        </>
                      )}
                    </Badge>
                    <span className={`text-xs ${
                      item.data.status === 'processed' ? 'text-gray-500' : 'text-muted-foreground'
                    }`}>
                      {format(item.data.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  
                  {item.data.processedAt && (
                    <span className="text-xs text-gray-400">
                      Processado em {format(item.data.processedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  )}
                </div>
                
                {/* Feedback content */}
                <div className={`rounded-r-lg p-3 ${
                  item.data.status === 'processed' 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-orange-50 border-orange-200'
                } border`}>
                  <p className={`text-sm leading-relaxed ${
                    item.data.status === 'processed' ? 'text-gray-600' : 'text-gray-800'
                  }`}>
                    {item.data.feedbackText}
                  </p>
                  
                  {item.data.feedbackImages && item.data.feedbackImages.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h5 className={`text-xs font-medium flex items-center gap-1 ${
                        item.data.status === 'processed' ? 'text-gray-500' : 'text-muted-foreground'
                      }`}>
                        <Image className="w-3 h-3" />
                        Imagens de Referência:
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {item.data.feedbackImages.map((image, imgIndex) => (
                          <ImageZoomModal
                            key={imgIndex}
                            imageSrc={image}
                            imageAlt={`Feedback image ${imgIndex + 1}`}
                          >
                            <img
                              src={image}
                              alt={`Feedback image ${imgIndex + 1}`}
                              className={`w-full h-16 object-cover rounded border cursor-pointer transition-opacity ${
                                item.data.status === 'processed' 
                                  ? 'opacity-60 hover:opacity-80' 
                                  : 'hover:opacity-80'
                              }`}
                              loading="lazy"
                            />
                          </ImageZoomModal>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Connector line (except for last item) */}
                {index < timelineItems.length - 1 && (
                  <div className="absolute left-0 top-8 w-px h-8 bg-gray-200" />
                )}
              </div>
            ) : (
              // Evento de aprovação
              <div className="relative border-l-4 pl-4 pb-4 border-green-400">
                {/* Timeline dot */}
                <div className="absolute -left-2 w-3 h-3 rounded-full bg-green-500" />
                
                {/* Approval header */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Post Aprovado
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(item.data.approvedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                
                {/* Approval content */}
                <div className="rounded-r-lg p-3 bg-green-50 border border-green-200">
                  <p className="text-sm text-green-800 font-medium">
                    ✅ Este post foi aprovado e está pronto para publicação
                  </p>
                </div>
                
                {/* Connector line (except for last item) */}
                {index < timelineItems.length - 1 && (
                  <div className="absolute left-0 top-8 w-px h-8 bg-gray-200" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackTimeline;
