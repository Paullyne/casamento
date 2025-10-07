import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, UserCheck, Users, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const rsvpSchema = z.object({
  guest_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  attending: z.enum(["true", "false"]),
  plus_ones: z.number().min(0).max(5),
  dietary_restrictions: z.string().optional(),
  message: z.string().optional(),
});

type RSVPFormData = z.infer<typeof rsvpSchema>;

export default function RSVPPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guest_name: "",
      email: "",
      phone: "",
      attending: "true",
      plus_ones: 0,
      dietary_restrictions: "",
      message: "",
    },
  });

  const onSubmit = async (data: RSVPFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('rsvps')
        .insert({
          guest_name: data.guest_name,
          email: data.email || null,
          phone: data.phone || null,
          attending: data.attending === "true",
          plus_ones: data.plus_ones,
          dietary_restrictions: data.dietary_restrictions || null,
          message: data.message || null,
        });

      if (error) throw error;

      toast({
        title: "RSVP Confirmado!",
        description: data.attending === "true" 
          ? "Obrigado por confirmar sua presença! Estamos ansiosos para celebrar com você."
          : "Obrigado por nos informar. Sentiremos sua falta!",
      });

      form.reset();
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua confirmação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const attending = form.watch("attending");

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-background via-accent/5 to-secondary/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <Heart className="h-16 w-16 text-primary mx-auto mb-6 animate-romantic" />
          <h1 className="text-4xl md:text-5xl font-romantic font-bold text-gradient-romantic mb-4">
            Confirme sua Presença
          </h1>
          <p className="text-lg text-muted-foreground font-elegant max-w-2xl mx-auto">
            Sua presença é muito importante para nós. Por favor, confirme até o dia 1º de dezembro.
          </p>
        </div>

        <Card className="card-romantic p-8 md:p-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="guest_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-romantic">Nome Completo *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Seu nome completo" 
                          {...field} 
                          className="h-12 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-romantic">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="seu.email@exemplo.com" 
                          {...field} 
                          className="h-12 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-romantic">Telefone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(11) 99999-9999" 
                          {...field} 
                          className="h-12 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="plus_ones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-romantic flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Acompanhantes
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          max="5"
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          className="h-12 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Attendance */}
              <FormField
                control={form.control}
                name="attending"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-xl font-romantic flex items-center gap-2">
                      <UserCheck className="h-6 w-6" />
                      Você confirmará presença?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 p-4 border rounded-lg border-accent/20 hover:bg-accent/5 transition-colors">
                          <RadioGroupItem value="true" id="attending-yes" />
                          <Label htmlFor="attending-yes" className="text-lg font-elegant cursor-pointer">
                            ✨ Sim, estarei presente!
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg border-accent/20 hover:bg-accent/5 transition-colors">
                          <RadioGroupItem value="false" id="attending-no" />
                          <Label htmlFor="attending-no" className="text-lg font-elegant cursor-pointer">
                            😔 Infelizmente não poderei comparecer
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional Fields for Attending Guests */}
              {attending === "true" && (
                <div className="space-y-6 animate-fade-up">
                  <FormField
                    control={form.control}
                    name="dietary_restrictions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-romantic">
                          Restrições Alimentares
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Alguma alergia ou restrição alimentar que devemos saber?"
                            className="min-h-20 text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-romantic flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Mensagem para os Noivos
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Deixe uma mensagem carinhosa para Albert e Pauline..."
                        className="min-h-24 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                size="lg"
                disabled={isSubmitting}
                className="btn-hero w-full text-lg py-6"
              >
                {isSubmitting ? "Enviando..." : "Confirmar RSVP"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}