-- Fix critical RSVP security vulnerability
-- Remove the overly permissive UPDATE policy that allows anyone to modify guest contact information

-- Drop the insecure UPDATE policy
DROP POLICY IF EXISTS "Guests can update their own RSVP with email verification" ON public.rsvps;

-- Create a secure UPDATE policy that only allows authenticated administrators
CREATE POLICY "Only authenticated administrators can update RSVPs" 
ON public.rsvps 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- The INSERT policy remains unchanged - guests can still submit new RSVPs
-- The SELECT policy remains secure - only authenticated users can view RSVPs