
-- FASE 1: Otimizações de Performance
-- Adicionar índices para melhorar performance das consultas
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_campaign_id ON posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);

-- FASE 2: Configurar Storage para imagens
-- Criar bucket para imagens de campanhas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('campaign-images', 'campaign-images', true)
ON CONFLICT (id) DO NOTHING;

-- Criar bucket para imagens de feedback
INSERT INTO storage.buckets (id, name, public) 
VALUES ('feedback-images', 'feedback-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para campaign-images bucket
CREATE POLICY "Campaign images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'campaign-images');

CREATE POLICY "Users can upload campaign images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'campaign-images');

CREATE POLICY "Users can update their campaign images" ON storage.objects
FOR UPDATE USING (bucket_id = 'campaign-images');

CREATE POLICY "Users can delete their campaign images" ON storage.objects
FOR DELETE USING (bucket_id = 'campaign-images');

-- Políticas para feedback-images bucket
CREATE POLICY "Feedback images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'feedback-images');

CREATE POLICY "Anyone can upload feedback images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'feedback-images');

CREATE POLICY "Anyone can update feedback images" ON storage.objects
FOR UPDATE USING (bucket_id = 'feedback-images');

CREATE POLICY "Anyone can delete feedback images" ON storage.objects
FOR DELETE USING (bucket_id = 'feedback-images');

-- FASE 1: Função otimizada para carregar campanhas
CREATE OR REPLACE FUNCTION public.get_campaigns_with_posts_optimized(user_id_param uuid)
RETURNS TABLE(
  id uuid, 
  title text, 
  description text, 
  client_name text, 
  client_email text, 
  share_link text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone,
  posts_count bigint,
  approved_count bigint,
  pending_count bigint,
  revision_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    c.client_name,
    c.client_email,
    c.share_link,
    c.created_at,
    c.updated_at,
    COALESCE(COUNT(p.id), 0) as posts_count,
    COALESCE(COUNT(p.id) FILTER (WHERE p.status = 'approved'), 0) as approved_count,
    COALESCE(COUNT(p.id) FILTER (WHERE p.status = 'pending'), 0) as pending_count,
    COALESCE(COUNT(p.id) FILTER (WHERE p.status = 'revision_requested'), 0) as revision_count
  FROM campaigns c
  LEFT JOIN posts p ON c.id = p.campaign_id
  WHERE c.user_id = user_id_param
  GROUP BY c.id, c.title, c.description, c.client_name, c.client_email, c.share_link, c.created_at, c.updated_at
  ORDER BY c.created_at DESC;
END;
$function$
