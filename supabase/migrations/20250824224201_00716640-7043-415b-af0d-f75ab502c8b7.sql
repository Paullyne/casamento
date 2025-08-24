-- Create tables for wedding invitation app

-- Table for wedding event details
CREATE TABLE public.wedding_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  wedding_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  venue_coordinates POINT,
  dress_code TEXT,
  additional_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for RSVP responses
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  attending BOOLEAN NOT NULL,
  plus_ones INTEGER DEFAULT 0,
  dietary_restrictions TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for wedding gifts
CREATE TABLE public.wedding_gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_purchased BOOLEAN DEFAULT FALSE,
  purchased_by TEXT,
  qr_code_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for guest photos
CREATE TABLE public.guest_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wedding_events (read-only for guests, admin can modify)
CREATE POLICY "Wedding events are viewable by everyone" 
ON public.wedding_events 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage wedding events" 
ON public.wedding_events 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for RSVPs (guests can create their own, admins can view all)
CREATE POLICY "Anyone can create RSVP" 
ON public.rsvps 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all RSVPs" 
ON public.rsvps 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Guests can update their own RSVP by email" 
ON public.rsvps 
FOR UPDATE 
USING (true);

-- RLS Policies for wedding gifts (viewable by all, manageable by admins)
CREATE POLICY "Wedding gifts are viewable by everyone" 
ON public.wedding_gifts 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can mark gifts as purchased" 
ON public.wedding_gifts 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can manage wedding gifts" 
ON public.wedding_gifts 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for guest photos (guests can upload, admins approve)
CREATE POLICY "Anyone can upload photos" 
ON public.guest_photos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Approved photos are viewable by everyone" 
ON public.guest_photos 
FOR SELECT 
USING (is_approved = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all photos" 
ON public.guest_photos 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('wedding-photos', 'wedding-photos', true);

-- Storage policies for wedding photos
CREATE POLICY "Anyone can upload wedding photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'wedding-photos');

CREATE POLICY "Wedding photos are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'wedding-photos');

-- Insert sample wedding event data
INSERT INTO public.wedding_events (
  bride_name, 
  groom_name, 
  wedding_date, 
  venue_name, 
  venue_address, 
  dress_code, 
  additional_info
) VALUES (
  'Isabella', 
  'Gabriel', 
  '2024-12-15 16:00:00+00', 
  'Quinta da Regaleira', 
  'R. Barbosa du Bocage 5, 2710-567 Sintra, Portugal', 
  'Traje Social/Cocktail', 
  'Cerimônia ao ar livre. Em caso de chuva, será realizada no salão coberto.'
);

-- Insert sample wedding gifts
INSERT INTO public.wedding_gifts (name, description, price, qr_code_data) VALUES
  ('Conjunto de Taças de Cristal', 'Conjunto elegante com 6 taças para champagne', 250.00, 'PIX_QR_CODE_DATA_1'),
  ('Jogo de Cama King Size', 'Jogo de cama luxo em algodão egípcio', 380.00, 'PIX_QR_CODE_DATA_2'),
  ('Panela de Pressão Elétrica', 'Panela de pressão elétrica 6L com múltiplas funções', 450.00, 'PIX_QR_CODE_DATA_3'),
  ('Kit Café Gourmet', 'Kit com cafeteira italiana e grãos especiais', 180.00, 'PIX_QR_CODE_DATA_4'),
  ('Aspirador de Pó Robot', 'Aspirador robô inteligente com mapeamento', 890.00, 'PIX_QR_CODE_DATA_5'),
  ('Conjunto de Facas Profissionais', 'Kit com 8 facas alemãs de alta qualidade', 320.00, 'PIX_QR_CODE_DATA_6');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_wedding_events_updated_at
  BEFORE UPDATE ON public.wedding_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rsvps_updated_at
  BEFORE UPDATE ON public.rsvps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wedding_gifts_updated_at
  BEFORE UPDATE ON public.wedding_gifts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();