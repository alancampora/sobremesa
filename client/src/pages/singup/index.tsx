import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NavigationMenu } from "@/components/NavigationMenu";
import { singup } from "@/api/auth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !context || !email || !password || !confirmPassword) {
      setError("Nombre, contexto, email y contraseña son obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    await singup({
      data: { email, password, name, context, bio },
      successCallback: () => {
        navigate("/login");
      },
      errorCallback: (error: string) => setError(error),
    });
  };

  return (
    <>
      <NavigationMenu />
      <main className="w-full min-w-md flex items-center justify-center p-4 mt-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Crear cuenta
            </CardTitle>
            <CardDescription className="text-center">
              Datos mínimos, sin métricas ni gamificación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Crear contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repetir contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Crear cuenta
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-center">
              ¿Ya tenés cuenta?{" "}
              <Link
                to={{ pathname: "/login" }}
                className="text-blue-500 hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
