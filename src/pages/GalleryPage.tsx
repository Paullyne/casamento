import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Camera, Upload, Heart, Clock } from "lucide-react";

interface GuestPhoto {
  id: string;
  photo_url: string;
  caption: string | null;
  uploaded_by: string;
  created_at: string;
  is_approved: boolean;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    caption: "",
    file: null as File | null
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('guest_photos')
        .select('*')
        //.eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const uploadPhoto = async () => {
    if (!uploadForm.file || !uploadForm.name.trim()) {
      toast.error('Por favor, preencha seu nome e selecione uma foto');
      return;
    }

    setUploading(true);
    try {
      // Upload da imagem para o storage
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('wedding-photos')
        .upload(fileName, uploadForm.file);

      if (uploadError) throw uploadError;

      // Obter URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(fileName);

      // Salvar dados da foto no banco
      const { error: dbError } = await supabase
        .from('guest_photos')
        .insert({
          photo_url: publicUrl,
          caption: uploadForm.caption.trim() || null,
          uploaded_by: uploadForm.name.trim()
        });

      if (dbError) throw dbError;

      toast.success('Foto enviada com sucesso! Ela já está visível na galeria 🎉');
      setUploadForm({ name: "", caption: "", file: null });
      
      // Reset file input
      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Erro ao enviar foto:', error);
      toast.error('Erro ao enviar a foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <Camera className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-romantic font-bold text-foreground mb-4">
            Galeria de Fotos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compartilhe seus momentos especiais da nossa celebração! 
            Envie suas fotos para que todos possam reviver esses momentos únicos.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Upload Section */}
        <Card className="card-romantic p-8 mb-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-romantic font-semibold text-primary mb-6 text-center">
            <Upload className="h-6 w-6 inline-block mr-2" />
            Enviar Nova Foto
          </h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="uploader-name" className="text-foreground font-elegant">
                Seu Nome *
              </Label>
              <Input
                id="uploader-name"
                type="text"
                placeholder="Digite seu nome"
                value={uploadForm.name}
                onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="photo-upload" className="text-foreground font-elegant">
                Escolher Foto *
              </Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Máximo 5MB - Formatos: JPG, PNG, WEBP
              </p>
            </div>

            <div>
              <Label htmlFor="photo-caption" className="text-foreground font-elegant">
                Legenda (opcional)
              </Label>
              <Textarea
                id="photo-caption"
                placeholder="Descreva este momento especial..."
                value={uploadForm.caption}
                onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                className="mt-2"
                rows={3}
              />
            </div>

            <Button 
              onClick={uploadPhoto}
              disabled={uploading || !uploadForm.file || !uploadForm.name.trim()}
              className="w-full btn-elegant"
            >
              {uploading ? (
                "Enviando..."
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Foto
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Photos Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-romantic font-semibold text-primary text-center mb-8">
            <Heart className="h-8 w-8 inline-block mr-3 text-primary" />
            Momentos Compartilhados
          </h2>

          {photos.length === 0 ? (
            <Card className="card-romantic p-8 text-center">
              <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                Ainda não há fotos na galeria. Seja o primeiro a compartilhar um momento especial!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <Card key={photo.id} className="card-romantic overflow-hidden">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={photo.photo_url}
                      alt={photo.caption || `Foto enviada por ${photo.uploaded_by}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-4">
                    {photo.caption && (
                      <p className="text-foreground mb-3 font-elegant">
                        {photo.caption}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="font-elegant">
                        Por: {photo.uploaded_by}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(photo.created_at)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <Card className="card-romantic p-6 max-w-3xl mx-auto">
          <h3 className="text-lg font-romantic font-semibold text-primary mb-4">
            Instruções para Upload
          </h3>
          <ul className="space-y-2 text-muted-foreground font-elegant">
            <li>• Todas as fotos passam por moderação antes de serem exibidas</li>
            <li>• Envie apenas fotos relacionadas ao casamento</li>
            <li>• Respeite a privacidade dos outros convidados</li>
            <li>• Tamanho máximo: 5MB por foto</li>
            <li>• Formatos aceitos: JPG, PNG, WEBP</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}