-- Clean up duplicate wedding events and keep only the most recent one
WITH ranked_events AS (
  SELECT id, 
         ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
  FROM public.wedding_events
)
DELETE FROM public.wedding_events 
WHERE id IN (
  SELECT id 
  FROM ranked_events 
  WHERE rn > 1
);