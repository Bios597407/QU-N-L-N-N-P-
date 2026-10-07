-- Supabase Private Storage Bucket Policies for Evidence
-- Evidence bucket is private. No permanent public URLs.
-- Requires signed URLs or authenticated user verification.

INSERT INTO storage.buckets (id, name, public)
VALUES ('incident-evidence', 'incident-evidence', false)
ON CONFLICT (id) DO UPDATE SET public = false;

CREATE POLICY "Authenticated members upload evidence"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'incident-evidence');

CREATE POLICY "Authorized members view evidence"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'incident-evidence');
