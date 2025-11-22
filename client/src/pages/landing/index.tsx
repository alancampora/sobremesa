import { useEffect } from "react";
import Landing from "@/components/landing";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router";

export default function LandingMain() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Si el usuario está logueado, redirigir a cartelera
    if (user && !loading) {
      navigate("/cartelera");
    }
  }, [user, loading, navigate]);

  const handleLogin = () => {
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  // Solo mostrar landing si no hay usuario
  return user ? null : <Landing onLogin={handleLogin} />;
}
