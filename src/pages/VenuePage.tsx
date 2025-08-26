import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Mail, Car, Utensils, Camera, Info } from "lucide-react";

interface WeddingEvent {
  id: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  venue_name: string;
  venue_address: string;
  dress_code: string;
  additional_info: string;
}

export default function VenuePage() {
  const [weddingData, setWeddingData] = useState<WeddingEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeddingData();
  }, []);

  const fetchWeddingData = async () => {
    try {
      const { data, error } = await supabase
        .from('wedding_events')
        .select('*')
        .single();

      if (error) throw error;
      setWeddingData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do casamento:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando informações do local...</p>
        </div>
      </div>
    );
  }

  if (!weddingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            Informações do local não encontradas.
          </p>
        </div>
      </div>
    );
  }

  const weddingDate = new Date(weddingData.wedding_date);
  const openMaps = () => {
    const address = encodeURIComponent(weddingData.venue_address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  const openWaze = () => {
    const address = encodeURIComponent(weddingData.venue_address);
    window.open(`https://www.waze.com/ul?q=${address}&navigate=yes`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <MapPin className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-romantic font-bold text-foreground mb-4">
            Local da Celebração
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Todas as informações sobre o local onde celebraremos nosso amor
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Venue Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main Venue Info */}
          <Card className="card-romantic p-8">
            <h2 className="text-3xl font-romantic font-semibold text-primary mb-6">
              {weddingData.venue_name}
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-elegant font-semibold text-foreground mb-2">Endereço</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {weddingData.venue_address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-elegant font-semibold text-foreground mb-2">Data e Horário</h3>
                  <p className="text-muted-foreground">
                    {weddingDate.toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-muted-foreground">
                    {weddingDate.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {weddingData.dress_code && (
                <div className="flex items-start gap-4">
                  <Camera className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-elegant font-semibold text-foreground mb-2">Dress Code</h3>
                    <p className="text-muted-foreground">{weddingData.dress_code}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button onClick={openMaps} className="btn-elegant flex-1">
                <MapPin className="h-4 w-4 mr-2" />
                Abrir no Google Maps
              </Button>
              <Button onClick={openWaze} variant="outline" className="flex-1">
                <MapPin className="h-4 w-4 mr-2" />
                Abrir no Waze
              </Button>
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="card-romantic p-8">
            <h2 className="text-2xl font-romantic font-semibold text-primary mb-6">
              Informações Importantes
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Car className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-elegant font-semibold text-foreground mb-2">Estacionamento</h3>
                  <p className="text-muted-foreground">
                    O local possui estacionamento gratuito para todos os convidados. 
                    Recomendamos chegar com antecedência para garantir uma vaga próxima.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Utensils className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-elegant font-semibold text-foreground mb-2">Refeições</h3>
                  <p className="text-muted-foreground">
                    Será servido jantar completo com opções vegetarianas e veganas. 
                    Por favor, informe restrições alimentares no RSVP.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-elegant font-semibold text-foreground mb-2">Contato do Local</h3>
                  <p className="text-muted-foreground">
                    Em caso de emergência ou dúvidas no dia do evento, 
                    entre em contato com a coordenação do local.
                  </p>
                </div>
              </div>

              {weddingData.additional_info && (
                <div className="flex items-start gap-4">
                  <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-elegant font-semibold text-foreground mb-2">Informações Adicionais</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {weddingData.additional_info}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Map Section */}
        <Card className="card-romantic p-8 mb-8">
          <h2 className="text-2xl font-romantic font-semibold text-primary mb-6 text-center">
            Localização
          </h2>
          
          <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
            <iframe
              src={`https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=pt&amp;q=${encodeURIComponent(weddingData.venue_address)}&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=&amp;output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do casamento"
            ></iframe>
          </div>
          
          <p className="text-center text-muted-foreground mt-4">
            Clique no mapa para obter direções detalhadas
          </p>
        </Card>

        {/* Transportation Tips */}
        <Card className="card-romantic p-6">
          <h3 className="text-lg font-romantic font-semibold text-primary mb-4 text-center">
            Dicas de Transporte
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <Car className="h-8 w-8 text-primary mx-auto" />
              <h4 className="font-elegant font-semibold">Carro</h4>
              <p className="text-sm text-muted-foreground">
                Estacionamento gratuito disponível
              </p>
            </div>
            <div className="space-y-2">
              <Phone className="h-8 w-8 text-primary mx-auto" />
              <h4 className="font-elegant font-semibold">Uber/99</h4>
              <p className="text-sm text-muted-foreground">
                Serviços disponíveis na região
              </p>
            </div>
            <div className="space-y-2">
              <Info className="h-8 w-8 text-primary mx-auto" />
              <h4 className="font-elegant font-semibold">Transporte</h4>
              <p className="text-sm text-muted-foreground">
                Entre em contato conosco para mais informações
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}