import { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NavigationMenu } from "@/components/navigationMenu";
import { useAuth } from "@/context/auth";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const { user, refetchUser } = useAuth();
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setContext(user.context || "");
      setBio(user.bio || "");
      setPhoto(user.photo || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !context) {
      setError("Nombre y contexto son obligatorios");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name,
            context,
            bio,
            photo,
          }),
        }
      );

      if (response.ok) {
        setSuccess(true);
        await refetchUser();
      } else {
        const data = await response.json();
        setError(data.message || "Error al actualizar el perfil");
      }
    } catch (err) {
      setError("Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <>
        <NavigationMenu />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Cargando...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <NavigationMenu />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Editar perfil</CardTitle>
            <CardDescription>
              Datos mínimos, sin métricas ni gamificación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre real</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">Contexto</Label>
                <Input
                  id="context"
                  type="text"
                  placeholder="Ej: Estudiante de Filosofía - UBA"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Carrera/facultad/ciudad/ocupación
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (opcional)</Label>
                <Textarea
                  id="bio"
                  placeholder="2-3 líneas sobre vos"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Foto (URL) - opcional</Label>
                <Input
                  id="photo"
                  type="url"
                  placeholder="https://ejemplo.com/tu-foto.jpg"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Por ahora solo URLs. Upload de imágenes próximamente.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  El email no se puede cambiar
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
                    ¡Perfil actualizado correctamente!
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
