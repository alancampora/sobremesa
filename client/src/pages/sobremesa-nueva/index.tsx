import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NavigationMenu } from "@/components/NavigationMenu";

export default function NuevaSobremesaPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("8");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !date || !time) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const participants = parseInt(maxParticipants);
    if (participants < 4 || participants > 15) {
      setError("El número de participantes debe estar entre 4 y 15");
      return;
    }

    const dateTime = new Date(`${date}T${time}`);
    if (dateTime < new Date()) {
      setError("La fecha debe ser futura");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/sobremesas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            description,
            date_time: dateTime.toISOString(),
            max_participants: participants,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        navigate(`/sobremesa/${data._id}`);
      } else {
        const data = await response.json();
        setError(data.message || "Error al crear la sobremesa");
      }
    } catch (err) {
      setError("Error al crear la sobremesa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavigationMenu />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Proponer una sobremesa</CardTitle>
            <CardDescription>
              Define el tema, fecha y cuántas personas buscás para conversar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tema / Título</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Ej: ¿Puede haber IA ética bajo capitalismo?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Contá de qué querés hablar, desde dónde viene tu interés, qué preguntas te movilizan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none min-h-[150px]"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Esto ayuda a que quienes escriban cartas sepan qué esperar
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">
                  ¿Cuántas personas buscás?
                </Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="4"
                  max="15"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Recomendado: 6-10 personas para conversaciones profundas
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/cartelera")}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Creando..." : "Proponer sobremesa"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
