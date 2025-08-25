-- Add missing RLS policies for tables that have RLS enabled but no policies

-- Add policies for reports table
CREATE POLICY "Only authenticated users can view reports" 
ON public.reports 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Only authenticated users can update reports" 
ON public.reports 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Add policies for story_views table  
CREATE POLICY "Users can view story views" 
ON public.story_views 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create story views" 
ON public.story_views 
FOR INSERT 
WITH CHECK (auth.uid() = viewer_id);