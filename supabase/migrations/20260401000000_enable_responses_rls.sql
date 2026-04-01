ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT ON TABLE public.responses TO anon;

CREATE POLICY anon_insert
ON public.responses
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY anon_select
ON public.responses
FOR SELECT
TO anon
USING (true);
