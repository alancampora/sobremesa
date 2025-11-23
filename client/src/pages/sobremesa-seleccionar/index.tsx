import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NavigationMenu } from "@/components/NavigationMenu";
import { Check, X, AlertCircle, Video, CheckCircle } from "lucide-react";

type Carta = {
  _id: string;
  text: string;
  status: "pending" | "accepted" | "rejected";
  user_id: {
    name: string;
    context: string;
    bio?: string;
    photo?: string;
  };
};

type Sobremesa = {
  title: string;
  max_participants: number;
  meeting_link?: string;
};

export default function SobremesaSeleccionarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sobremesa, setSobremesa] = useState<Sobremesa | null>(null);
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [savingLink, setSavingLink] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);

  useEffect(() => {
    fetchSobremesa();
    fetchCartas();
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
        setMeetingLink(data.meeting_link || "");
      }
    } catch (error) {
      console.error("Error fetching sobremesa:", error);
    }
  };

  const fetchCartas = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cartas/sobremesa/${id}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCartas(data);
      } else {
        setError("No tenés permiso para ver estas cartas");
      }
    } catch (error) {
      console.error("Error fetching cartas:", error);
      setError("Error al cargar las cartas");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (cartaId: string, status: "accepted" | "rejected") => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cartas/${cartaId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        // Update local state
        setCartas((prev) =>
          prev.map((carta) =>
            carta._id === cartaId ? { ...carta, status } : carta
          )
        );
      }
    } catch (error) {
      console.error("Error updating carta:", error);
    }
  };

  const getAcceptedCount = () => {
    return cartas.filter((c) => c.status === "accepted").length;
  };

  const getPendingCount = () => {
    return cartas.filter((c) => c.status === "pending").length;
  };

  const handleSaveMeetingLink = async () => {
    setSavingLink(true);
    setLinkSuccess(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/sobremesas/${id}/meeting-link`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ meeting_link: meetingLink }),
        }
      );

      if (response.ok) {
        setLinkSuccess(true);
        setTimeout(() => setLinkSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error saving meeting link:", error);
    } finally {
      setSavingLink(false);
    }
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

  if (error) {
    return (
      <>
        <NavigationMenu />
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </main>
      </>
    );
  }

  const maxParticipants = sobremesa?.max_participants || 0;
  const acceptedCount = getAcceptedCount();
  const spotsLeft = maxParticipants - acceptedCount;

  return (
    <>
      <NavigationMenu />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate("/mis-sobremesas")}>
            ← Volver a mis sobremesas
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{sobremesa?.title}</h1>
          <p className="text-muted-foreground">
            Panel de selección - {cartas.length} cartas recibidas
          </p>
        </div>

        {/* Status Summary */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{acceptedCount}</p>
                <p className="text-sm text-muted-foreground">Aceptados</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{getPendingCount()}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{spotsLeft}</p>
                <p className="text-sm text-muted-foreground">Lugares disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meeting Link */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="h-5 w-5" />
              Link de la sala
            </CardTitle>
            <CardDescription>
              Agregá el link de la videollamada (Jitsi, Google Meet, Zoom, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://meet.jit.si/sobremesa-..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveMeetingLink} disabled={savingLink}>
                {savingLink ? "Guardando..." : "Guardar"}
              </Button>
            </div>
            {linkSuccess && (
              <Alert className="bg-green-50 border-green-200 mt-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900">
                  Link guardado! Los participantes ya pueden verlo.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {spotsLeft === 0 && getPendingCount() > 0 && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-900">
              Ya alcanzaste el máximo de participantes. Podés rechazar las cartas
              pendientes o aceptar más si querés ampliar el grupo.
            </AlertDescription>
          </Alert>
        )}

        {cartas.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Todavía no recibiste cartas de intención
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cartas.map((carta) => (
              <Card
                key={carta._id}
                className={
                  carta.status === "accepted"
                    ? "border-green-200 bg-green-50"
                    : carta.status === "rejected"
                    ? "border-gray-200 bg-gray-50 opacity-60"
                    : ""
                }
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {carta.user_id.name}
                      </CardTitle>
                      <CardDescription>
                        {carta.user_id.context}
                        {carta.user_id.bio && (
                          <>
                            <br />
                            <span className="text-xs mt-1 block">
                              {carta.user_id.bio}
                            </span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                    {carta.status === "accepted" && (
                      <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                        Aceptado
                      </span>
                    )}
                    {carta.status === "rejected" && (
                      <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        Rechazado
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none mb-4">
                    <p className="whitespace-pre-wrap text-sm">{carta.text}</p>
                  </div>

                  {carta.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleUpdateStatus(carta._id, "accepted")}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Aceptar
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleUpdateStatus(carta._id, "rejected")}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
