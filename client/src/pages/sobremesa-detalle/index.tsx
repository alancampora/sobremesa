import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NavigationMenu } from "@/components/navigationMenu";
import { Calendar, Users, AlertCircle, CheckCircle } from "lucide-react";

type Sobremesa = {
  _id: string;
  title: string;
  description: string;
  date_time: string;
  max_participants: number;
  convocante_id: {
    _id: string;
    name: string;
    context: string;
    bio?: string;
    photo?: string;
  };
  status: string;
};

type CartaCheck = {
  has_carta: boolean;
  carta: {
    text: string;
    status: string;
  } | null;
};

export default function SobremesaDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sobremesa, setSobremesa] = useState<Sobremesa | null>(null);
  const [cartaText, setCartaText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cartaCheck, setCartaCheck] = useState<CartaCheck | null>(null);

  useEffect(() => {
    fetchSobremesa();
    checkCarta();
  }, [id]);

  const fetchSobremesa = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/sobremesas/${id}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSobremesa(data);
      }
    } catch (error) {
      console.error("Error fetching sobremesa:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkCarta = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cartas/check/${id}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCartaCheck(data);
      }
    } catch (error) {
      console.error("Error checking carta:", error);
    }
  };

  const handleSubmitCarta = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const wordCount = cartaText.trim().split(/\s+/).length;
    if (wordCount < 50) {
      setError("La carta debe tener al menos 50 palabras");
      return;
    }
    if (wordCount > 500) {
      setError("La carta no puede tener más de 500 palabras");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cartas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          sobremesa_id: id,
          text: cartaText,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setCartaText("");
        checkCarta(); // Refresh carta status
      } else {
        const data = await response.json();
        setError(data.message || "Error al enviar la carta");
      }
    } catch (err) {
      setError("Error al enviar la carta");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWordCount = () => {
    return cartaText.trim().split(/\s+/).filter(Boolean).length;
  };

  if (loading) {
    return (
      <>
        <NavigationMenu />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Cargando...</p>
        </main>
      </>
    );
  }

  if (!sobremesa) {
    return (
      <>
        <NavigationMenu />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            Sobremesa no encontrada
          </p>
        </main>
      </>
    );
  }

  const getCartaStatusMessage = () => {
    if (!cartaCheck?.has_carta) return null;

    const status = cartaCheck.carta?.status;
    if (status === "pending") {
      return (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            Tu carta está pendiente de revisión por el convocante
          </AlertDescription>
        </Alert>
      );
    }
    if (status === "accepted") {
      return (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            ¡Tu carta fue aceptada! Vas a participar de esta sobremesa
          </AlertDescription>
        </Alert>
      );
    }
    if (status === "rejected") {
      return (
        <Alert className="bg-gray-50 border-gray-200">
          <AlertCircle className="h-4 w-4 text-gray-600" />
          <AlertDescription className="text-gray-900">
            El convocante eligió otros participantes. Podés armar tu propia
            sobremesa sobre este tema.
          </AlertDescription>
        </Alert>
      );
    }
  };

  return (
    <>
      <NavigationMenu />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="outline" onClick={() => navigate("/cartelera")} className="mb-6">
          ← Volver a cartelera
        </Button>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{sobremesa.title}</CardTitle>
                <CardDescription>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(sobremesa.date_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Busca {sobremesa.max_participants} personas</span>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{sobremesa.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Carta de intención */}
            {!cartaCheck?.has_carta ? (
              <Card>
                <CardHeader>
                  <CardTitle>Carta de intención</CardTitle>
                  <CardDescription>
                    Explicá por qué te interesa este tema y desde dónde pensás
                    (200-300 palabras sugeridas)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitCarta} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="carta">Tu carta</Label>
                      <Textarea
                        id="carta"
                        placeholder="Escribí tu carta de intención..."
                        value={cartaText}
                        onChange={(e) => setCartaText(e.target.value)}
                        className="resize-none min-h-[200px]"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        {getWordCount()} palabras (mínimo 50, máximo 500)
                      </p>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-900">
                          ¡Carta enviada! El convocante la revisará y te
                          notificará.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? "Enviando..." : "Enviar carta de intención"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              getCartaStatusMessage()
            )}
          </div>

          {/* Sidebar - Convocante Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Convocante</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{sobremesa.convocante_id.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {sobremesa.convocante_id.context}
                    </p>
                  </div>
                  {sobremesa.convocante_id.bio && (
                    <p className="text-sm">{sobremesa.convocante_id.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
