import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Landing() {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        <div>
          <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
            <span className="text-6xl">🍷</span>
            <h1 className="font-extrabold text-5xl lg:text-7xl tracking-tight">
              Sobremesa
            </h1>
          </div>
          <p className="text-xl lg:text-2xl font-medium text-muted-foreground">
            Conversaciones profundas, grupos pequeños, encuentros sincrónicos
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-lg opacity-80 leading-relaxed max-w-2xl">
            No es red social. No hay likes, followers, ni algoritmos.
            Solo personas que quieren conversar sobre temas que les importan.
          </p>
          <p className="text-lg opacity-80 leading-relaxed max-w-2xl">
            <strong>6-10 personas máximo.</strong> Video obligatorio desde el inicio.
            El convocante lee cartas de intención y selecciona participantes.
          </p>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
          <Link to="/cartelera">
            <Button size="lg" className="w-full sm:w-auto">
              Ver cartelera
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Crear cuenta
            </Button>
          </Link>
        </div>

        <div className="text-sm opacity-60 max-w-xl">
          <p>
            Sin métricas. Sin gamificación. Sin extracción de datos.
            <br />
            Una plataforma deliberadamente ineficiente, porque la profundidad
            requiere tiempo.
          </p>
        </div>
      </div>
    </section>
  );
}
