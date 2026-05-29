
-- Criar tabela para histórico de feedbacks
CREATE TABLE public.post_feedbacks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  feedback_text TEXT NOT NULL,
  feedback_images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'ignored')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Adicionar RLS para segurança
ALTER TABLE public.post_feedbacks ENABLE ROW LEVEL SECURITY;

-- Policy para leitura pública (necessário para o link de revisão do cliente)
CREATE POLICY "Public can view post feedbacks" 
  ON public.post_feedbacks 
  FOR SELECT 
  USING (true);

-- Policy para inserção pública (cliente pode adicionar feedback)
CREATE POLICY "Public can create post feedbacks" 
  ON public.post_feedbacks 
  FOR INSERT 
  WITH CHECK (true);

-- Policy para atualização pública (marcar como processado)
CREATE POLICY "Public can update post feedbacks" 
  ON public.post_feedbacks 
  FOR UPDATE 
  USING (true);

-- Migrar feedbacks existentes da tabela posts para post_feedbacks
INSERT INTO public.post_feedbacks (post_id, feedback_text, feedback_images, status, created_at, processed_at)
SELECT 
  id as post_id,
  feedback as feedback_text,
  COALESCE(feedback_images, '{}') as feedback_images,
  CASE 
    WHEN status = 'revision_requested' THEN 'pending'
    ELSE 'processed'
  END as status,
  created_at,
  CASE 
    WHEN status != 'revision_requested' THEN updated_at
    ELSE NULL
  END as processed_at
FROM public.posts 
WHERE feedback IS NOT NULL AND feedback != '';

-- Criar índice para performance
CREATE INDEX idx_post_feedbacks_post_id ON public.post_feedbacks(post_id);
CREATE INDEX idx_post_feedbacks_status ON public.post_feedbacks(status);
