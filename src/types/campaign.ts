
export interface PostFeedback {
  id: string;
  feedbackText: string;
  feedbackImages: string[];
  status: 'pending' | 'processed' | 'ignored';
  createdAt: Date;
  processedAt?: Date;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  images: string[];
  status: 'pending' | 'approved' | 'revision_requested';
  feedback?: string; // Deprecated - mantido para compatibilidade
  feedbackImages?: string[]; // Deprecated - mantido para compatibilidade
  feedbacks: PostFeedback[]; // Novo sistema de múltiplos feedbacks
  scheduledDate?: Date;
  approvedAt?: Date; // Nova propriedade para rastrear quando foi aprovado
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  clientName: string;
  clientEmail: string;
  userId?: string;
  posts: Post[];
  createdAt: Date;
  updatedAt: Date;
  shareLink: string;
}
