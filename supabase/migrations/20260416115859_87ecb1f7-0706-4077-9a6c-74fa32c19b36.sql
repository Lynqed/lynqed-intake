
CREATE TABLE public.intake_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  goals JSONB NOT NULL DEFAULT '{}'::jsonb,
  target JSONB NOT NULL DEFAULT '{}'::jsonb,
  marketing JSONB NOT NULL DEFAULT '{}'::jsonb,
  samenwerking JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.intake_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert intake submissions"
ON public.intake_submissions
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "No public read access"
ON public.intake_submissions
FOR SELECT
TO anon
USING (false);
