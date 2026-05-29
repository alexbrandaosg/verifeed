
-- Remover todas as políticas RLS existentes nas tabelas campaigns e posts
DROP POLICY IF EXISTS "Enable read access for all users" ON public.campaigns;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.campaigns;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.campaigns;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.campaigns;
DROP POLICY IF EXISTS "Users can view their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Public access to campaigns" ON public.campaigns;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.posts;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.posts;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.posts;
DROP POLICY IF EXISTS "Users can view posts" ON public.posts;
DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete posts" ON public.posts;
DROP POLICY IF EXISTS "Public access to posts" ON public.posts;

-- Criar políticas simples e claras
-- Para campanhas: acesso público para leitura, apenas usuários autenticados para modificação
CREATE POLICY "Public read access to campaigns" ON public.campaigns
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" ON public.campaigns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns" ON public.campaigns
  FOR DELETE USING (auth.uid() = user_id);

-- Para posts: acesso público para leitura, apenas usuários autenticados para modificação
CREATE POLICY "Public read access to posts" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = posts.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update posts in their campaigns" ON public.posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = posts.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete posts in their campaigns" ON public.posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = posts.campaign_id 
      AND campaigns.user_id = auth.uid()
    )
  );
