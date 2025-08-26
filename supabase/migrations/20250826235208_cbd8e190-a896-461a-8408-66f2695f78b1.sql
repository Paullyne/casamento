-- Insert wedding event data for Chácara Santa Clara
INSERT INTO public.wedding_events (
  bride_name,
  groom_name,
  wedding_date,
  venue_name,
  venue_address,
  dress_code,
  additional_info
) VALUES (
  'Noiva',
  'Noivo',
  '2025-12-13T13:00:00-03:00',
  'Chácara Santa Clara (Dona Filó)',
  'BR-120 - Dona Eusébia, Dona Euzébia - MG, 36784-000',
  'Traje esporte fino ou social',
  'A cerimônia será realizada em ambiente aberto. Recomendamos sapatos confortáveis. Em caso de chuva, temos área coberta disponível.'
)
ON CONFLICT (id) DO UPDATE SET
  bride_name = EXCLUDED.bride_name,
  groom_name = EXCLUDED.groom_name,
  wedding_date = EXCLUDED.wedding_date,
  venue_name = EXCLUDED.venue_name,
  venue_address = EXCLUDED.venue_address,
  dress_code = EXCLUDED.dress_code,
  additional_info = EXCLUDED.additional_info;