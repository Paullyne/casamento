import { useEffect, useState } from "react";
import { Heart, Gift, CheckCircle, QrCode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import weddingGifts from "@/assets/wedding-gifts.jpg";

interface WeddingGift {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  is_purchased: boolean;
  purchased_by: string | null;
  qr_code_data: string | null;
}

export default function GiftsPage() {
  const [gifts, setGifts] = useState<WeddingGift[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('wedding_gifts')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      setGifts(data || []);
    } catch (error) {
      console.error('Error fetching gifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseGift = async (giftId: string, giftName: string) => {
    const buyerName = prompt(`Para presentear com "${giftName}", por favor digite seu nome:`);
    
    if (!buyerName) return;

    try {
      const { error } = await supabase
        .from('wedding_gifts')
        .update({ 
          is_purchased: true, 
          purchased_by: buyerName 
        })
        .eq('id', giftId);

      if (error) throw error;

      toast({
        title: "Presente Reservado!",
        description: `Obrigado ${buyerName}! O presente "${giftName}" foi reservado em seu nome.`,
      });

      // Refresh the gifts list
      fetchGifts();
    } catch (error) {
      console.error('Error purchasing gift:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao reservar o presente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-background via-accent/5 to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <Heart className="h-16 w-16 text-primary mx-auto mb-6 animate-romantic" />
          <h1 className="text-4xl md:text-5xl font-romantic font-bold text-gradient-romantic mb-4">
            Lista de Presentes
          </h1>
          <p className="text-lg text-muted-foreground font-elegant max-w-2xl mx-auto">
            Sua generosidade nos ajudará a começar nossa nova jornada juntos. 
            Clique no presente desejado para ver o QR Code do PIX.
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-16 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="relative rounded-2xl overflow-hidden shadow-elegant max-w-4xl mx-auto">
            <img 
              src={weddingGifts} 
              alt="Wedding gifts" 
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h2 className="text-2xl md:text-3xl font-romantic font-bold mb-2">
                Presentes Especiais
              </h2>
              <p className="text-lg font-elegant opacity-90">
                Cada presente é uma bênção para nosso lar
              </p>
            </div>
          </div>
        </div>

        {/* Gifts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gifts.map((gift, index) => (
            <Card 
              key={gift.id} 
              className="card-romantic overflow-hidden group hover:scale-105 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                  <Gift className="h-16 w-16 text-primary/50 group-hover:text-primary transition-colors duration-300" />
                </div>
                {gift.is_purchased && (
                  <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Reservado
                  </Badge>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-romantic font-semibold mb-2 text-foreground">
                  {gift.name}
                </h3>
                <p className="text-muted-foreground font-elegant mb-4 text-sm">
                  {gift.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-romantic font-bold text-primary">
                    R$ {gift.price.toFixed(2)}
                  </span>
                </div>

                {gift.is_purchased ? (
                  <div className="text-center">
                    <Badge variant="secondary" className="text-sm">
                      Reservado por {gift.purchased_by}
                    </Badge>
                  </div>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="btn-hero w-full">
                        <QrCode className="h-4 w-4 mr-2" />
                        Presentear
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-romantic text-xl text-center">
                          {gift.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="text-center">
                          <p className="text-lg font-elegant mb-2">Valor: R$ {gift.price.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Escaneie o QR Code abaixo para fazer a transferência PIX
                          </p>
                        </div>
                        
                        <div className="flex justify-center">
                          <div className="w-48 h-48 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg flex items-center justify-center">
                            <QrCode className="h-24 w-24 text-primary/50" />
                          </div>
                        </div>
                        
                        <div className="text-center text-sm text-muted-foreground">
                          <p>PIX: isabella.gabriel@casamento.com</p>
                          <p className="mt-2">
                            Chave PIX simulada para demonstração
                          </p>
                        </div>

                        <Button 
                          onClick={() => handlePurchaseGift(gift.id, gift.name)}
                          className="btn-hero w-full"
                        >
                          Confirmar Presente
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Card className="card-romantic p-8 max-w-2xl mx-auto">
            <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-romantic font-semibold mb-3">
              Outras Formas de Presentear
            </h3>
            <p className="text-muted-foreground font-elegant mb-4">
              Se preferir, você também pode contribuir com qualquer valor via PIX ou 
              escolher um presente não listado aqui.
            </p>
            <div className="text-center text-sm text-muted-foreground">
              <p>PIX dos Noivos: <strong>isabella.gabriel@casamento.com</strong></p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}