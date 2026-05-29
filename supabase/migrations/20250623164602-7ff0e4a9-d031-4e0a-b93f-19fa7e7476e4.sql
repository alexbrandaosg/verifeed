
-- Atualizar URLs das campanhas existentes para o novo domínio
UPDATE campaigns 
SET share_link = REPLACE(share_link, 'aprovaai.lovable.app', 'verifeed-app.lovable.app')
WHERE share_link LIKE '%aprovaai.lovable.app%';

UPDATE campaigns 
SET share_link = REPLACE(share_link, '47d11f71-4ead-4a4d-9110-467ed1ae556e.lovable.app', 'verifeed-app.lovable.app')
WHERE share_link LIKE '%47d11f71-4ead-4a4d-9110-467ed1ae556e.lovable.app%';

-- Atualizar a função create_campaign para usar o domínio correto
CREATE OR REPLACE FUNCTION public.create_campaign(title_param text, description_param text, client_name_param text, user_id_param uuid)
RETURNS TABLE(id uuid, title text, description text, client_name text, client_email text, share_link text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  new_campaign_id uuid;
  share_url text;
BEGIN
  new_campaign_id := gen_random_uuid();
  share_url := concat('https://verifeed-app.lovable.app/review/', new_campaign_id);
  
  INSERT INTO campaigns (
    id,
    title,
    description,
    client_name,
    client_email,
    share_link,
    user_id
  ) VALUES (
    new_campaign_id,
    title_param,
    description_param,
    client_name_param,
    concat(client_name_param, '@sistema.com'),
    share_url,
    user_id_param
  );
  
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    c.client_name,
    c.client_email,
    c.share_link,
    c.created_at,
    c.updated_at
  FROM campaigns c
  WHERE c.id = new_campaign_id;
END;
$function$
