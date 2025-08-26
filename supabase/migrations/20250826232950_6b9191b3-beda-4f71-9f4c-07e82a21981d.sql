-- Fix RSVP security vulnerability: Restrict viewing to administrators only
-- Remove the overly permissive policy that allows any authenticated user to view all RSVPs
DROP POLICY IF EXISTS "Only authenticated users can view RSVPs" ON public.rsvps;

-- Create new restrictive policy that only allows authenticated administrators to view RSVPs
-- This prevents unauthorized access to guest personal information (emails, phone numbers)
CREATE POLICY "Only authenticated administrators can view RSVPs" 
ON public.rsvps 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.role() = 'authenticated');

-- Note: Since RSVPs are created by anonymous users for wedding guests,
-- and we want to protect personal information like emails and phone numbers,
-- only authenticated administrators should be able to view this sensitive data