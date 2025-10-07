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
  'Pauline', 
  'Albert', 
  '2025-12-13 13:00:00+00', 
  'Chácara Santa Clara - Dona Filó', 
  'BR-120 - Dona Eusébia, Dona Euzébia - MG, 36784-000', 
  'Traje Social/Esporte Fino', 
  'Cerimônia ao ar livre. Em caso de chuva, não se preocupe, o ambiente estará protegido com tendas.'
);

-- Insert sample wedding gifts
INSERT INTO public.wedding_gifts (name, description, price, qr_code_data) VALUES
  ('Velas Aromáticas', 'Velas aromáticas para disfarçar o cheiro da treta 🕯️🔥', 50.00, 'PIX_QR_CODE_DATA_1'),
  ('Colchão Inflável', 'Colchão inflável de emergência — para quando alguém for “pro sofá” 🛏️➡️🛋️', 100.00, 'PIX_QR_CODE_DATA_2'),
  ('Panela de Pressão Elétrica', 'Panela de pressão elétrica 6L com múltiplas funções, só pra evitar explodir a casa mesmo', 150.00, 'PIX_QR_CODE_DATA_3'),
  ('Kit Café Gourmet', 'Kit com cafeteira italiana e grãos especiais. A noiva adora café!', 100.00, 'PIX_QR_CODE_DATA_4'),
  ('Aspirador de Pó Robot', 'Aspirador robô inteligente com mapeamento. Tecnologia e ciência juntas, para ajudar a manter a casa habitável', 150.00, 'PIX_QR_CODE_DATA_5'),
  ('Camiseta Homem', 'Camiseta “Sou sempre a razão” (edição para o noivo) 👕😏', 30.00, 'PIX_QR_CODE_DATA_5'),
  ('Camiseta Mulher', 'Camiseta “Tenho razão, mas finjo que não” (edição para a noiva) 👚😉', 30.00, 'PIX_QR_CODE_DATA_6'),
  ('Chocolate', 'Caixa de chocolates para dias de treta 🍫🔥', 50.00, 'PIX_QR_CODE_DATA_6'),
  ('Spray Anti-Ciúmes', 'Spray anti-ciúmes (funciona 0%, mas a intenção conta)', 35.00, 'PIX_QR_CODE_DATA_6'),
  ('Kit PAZ & AMOR', 'Kit “paz e amor” (válido para 1 discussão por mês) 🕊️💢', 40.00, 'PIX_QR_CODE_DATA_6'),
  ('Cartões de “Passe Livre”', 'Pode usar para escapar de uma DR por mês (limitado) 🃏✋', 50.00, 'PIX_QR_CODE_DATA_6'),
  ('Cofrinho', 'Cofrinho “arrependimentos instantâneos” 🐷😬', 20.00, 'PIX_QR_CODE_DATA_6'),
  ('Vale Massagem', 'Vale-massagem vitalício (de preferência profissional, não amador) 💆‍♀️', 150.00, 'PIX_QR_CODE_DATA_6'),
  ('Kit S.O.S', 'Kit “S.O.S. ressaca de lua de mel” 🍾🥴', 70.00, 'PIX_QR_CODE_DATA_6'),
  ('Botão de Pausa', 'Botão de pausa para sogra (funciona só na imaginação) 🛑👵', 50.00, 'PIX_QR_CODE_DATA_6'),
  ('Jogo de Panelas', 'Jogo de panelas anti-briga (com tampa que fecha a discussão) 🍳🫧', 250.00, 'PIX_QR_CODE_DATA_6'),
  ('Varinha Mágica', 'Varinha mágica para transformar “Sim, Amor” em realidade 🪄😉', 50.00, 'PIX_QR_CODE_DATA_6'),
  ('Extintor de DR', 'Extintor de DR (Discussão de Relacionamento) pra acabar de vez com aquela conversa chata 🧯❤️', 100.00, 'PIX_QR_CODE_DATA_6'),
  ('Cueca da Sorte', 'Cueca boxer especial para trazer sorte para o noivo e fazer a noiva animar', 25.00, 'PIX_QR_CODE_DATA_6'),
  ('Livro', 'Livro “Como não dormir de calça jeans depois da briga” 📖😤', 80.00, 'PIX_QR_CODE_DATA_6'),
  ('Alarme de DR', 'Toca antes que alguém fale “precisamos conversar” 🚨🗣️', 50.00, 'PIX_QR_CODE_DATA_6');

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