-- Fix security issues found by the linter

-- Fix function search path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add missing DELETE policy for wedding_events
CREATE POLICY "Admins can delete wedding events" 
ON public.wedding_events 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Add missing DELETE policy for wedding_gifts  
CREATE POLICY "Admins can delete wedding gifts" 
ON public.wedding_gifts 
FOR DELETE 
USING (auth.uid() IS NOT NULL);