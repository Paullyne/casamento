import { useEffect, useState } from "react";
import { Heart, Calendar, MapPin, Clock, UserCheck, Gift, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import weddingHero from "@/assets/wedding-hero6.jpg";
import weddingRings from "@/assets/wedding-rings.jpg";

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

export default function WeddingHome() {
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
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setWeddingData(data);
    } catch (error) {
      console.error('Error fetching wedding data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!weddingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Dados do casamento não encontrados.</p>
      </div>
    );
  }

  const weddingDate = new Date(weddingData.wedding_date);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center bg-no-repeat brightness-90 contrast-110 bg-cover md:bg-cover bg-[position:center top] md:bg-center"
        style={{ backgroundImage: `url(${weddingHero})` }}
      >
        {/*<div className="absolute inset-0 bg-black/40 backdrop-brightness-75"></div>*/}
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 animate-fade-up">
          <div className="mb-8">
            <Heart className="h-16 w-16 text-primary mx-auto mb-6 animate-romantic" style={{ color: '#88E788' }}/>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-romantic font-bold text-gradient-romantic mb-4"style={{ color: '#88E788' }}>
              {weddingData.bride_name} & {weddingData.groom_name}
            </h1>
            <p className="text-xl md:text-2xl font-elegant mb-8" style={{ color: '#88E788' }}>
              Celebrando nosso amor eterno
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 text-lg">
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-elegant" style={{ color: '#88E788' }}>
                {weddingDate.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-elegant" style={{ color: '#88E788' }}>
                {weddingDate.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-elegant" style={{ color: '#88E788' }}>{weddingData.venue_name}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-hero text-lg px-8 py-6">
              <Link to="/rsvp">Confirmar Presença</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="btn-elegant text-lg px-8 py-6">
              <Link to="/gifts">Ver Presentes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 bg-gradient-to-br from-background via-accent/5 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-romantic font-bold text-gradient-romantic mb-4">
              Contagem Regressiva
            </h2>
            <p className="text-lg text-muted-foreground font-elegant max-w-2xl mx-auto">
              Estamos ansiosos para celebrar este momento especial com vocês!
            </p>
          </div>
          
          <CountdownTimer targetDate={weddingDate} />
        </div>
      </section>

      {/* Details Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-romantic font-bold text-gradient-romantic mb-6">
                Nosso Dia Especial
              </h2>
              <div className="space-y-6">
                <Card className="card-romantic p-6">
                  <h3 className="text-xl font-romantic font-semibold mb-3 text-primary">
                    Local da Cerimônia
                  </h3>
                  <p className="text-foreground font-elegant mb-2">{weddingData.venue_name}</p>
                  <p className="text-muted-foreground">{weddingData.venue_address}</p>
                </Card>

                <Card className="card-romantic p-6">
                  <h3 className="text-xl font-romantic font-semibold mb-3 text-primary">
                    Dress Code
                  </h3>
                  <p className="text-foreground font-elegant">{weddingData.dress_code}</p>
                </Card>

                <Card className="card-romantic p-6">
                  <h3 className="text-xl font-romantic font-semibold mb-3 text-primary">
                    Informações Importantes
                  </h3>
                  <p className="text-foreground font-elegant">{weddingData.additional_info}</p>
                </Card>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-elegant group">
                <img 
                  src={weddingRings} 
                  alt="Wedding rings" 
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/*<div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>*/}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-gradient-to-br from-secondary/10 via-accent/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-romantic font-bold text-gradient-romantic mb-4">
              Participe da Nossa Celebração
            </h2>
            <p className="text-lg text-muted-foreground font-elegant max-w-2xl mx-auto">
              Sua presença é o maior presente que podemos receber
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-glass p-8 text-center group hover:scale-105 transition-all duration-300">
              <UserCheck className="h-12 w-12 text-primary mx-auto mb-4 group-hover:animate-pulse" />
              <h3 className="text-xl font-romantic font-semibold mb-3">Confirme sua Presença</h3>
              <p className="text-muted-foreground mb-6 font-elegant">
                Por favor, confirme sua presença até o dia 1º de dezembro
              </p>
              <Button asChild className="btn-hero w-full">
                <Link to="/rsvp">Confirmar RSVP</Link>
              </Button>
            </Card>

            <Card className="card-glass p-8 text-center group hover:scale-105 transition-all duration-300">
              <Gift className="h-12 w-12 text-primary mx-auto mb-4 group-hover:animate-pulse" />
              <h3 className="text-xl font-romantic font-semibold mb-3">Lista de Presentes</h3>
              <p className="text-muted-foreground mb-6 font-elegant">
                Escolha um presente da nossa lista especial
              </p>
              <Button asChild variant="outline" className="btn-elegant w-full">
                <Link to="/gifts">Ver Presentes</Link>
              </Button>
            </Card>

            <Card className="card-glass p-8 text-center group hover:scale-105 transition-all duration-300">
              <Camera className="h-12 w-12 text-primary mx-auto mb-4 group-hover:animate-pulse" />
              <h3 className="text-xl font-romantic font-semibold mb-3">Compartilhe Momentos</h3>
              <p className="text-muted-foreground mb-6 font-elegant">
                Envie suas fotos da nossa celebração
              </p>
              <Button asChild variant="outline" className="btn-elegant w-full">
                <Link to="/gallery">Galeria</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}