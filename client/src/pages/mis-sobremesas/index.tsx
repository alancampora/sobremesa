import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavigationMenu } from "@/components/NavigationMenu";
import { Calendar, Users, Settings, Video } from "lucide-react";

type Sobremesa = {
  _id: string;
  title: string;
  description: string;
  date_time: string;
  max_participants: number;
  convocante_id: {
    name: string;
    context: string;
  };
  status: string;
  my_role: "convocante" | "participant";
  meeting_link?: string;
};

export default function MisSobremesasPage() {
  const [sobremesas, setSobremesas] = useState<Sobremesa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMisSobremesas();
  }, []);

  const fetchMisSobremesas = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/sobremesas/mis-sobremesas/all`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSobremesas(data);
      }
    } catch (error) {
      console.error("Error fetching sobremesas:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isPast = date < now;

    return {
      formatted: date.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }),
      isPast,
    };
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      proposed: "Propuesta",
      confirmed: "Confirmada",
      completed: "Completada",
      cancelled: "Cancelada",
    };
    return labels[status] || status;
  };

  const groupedSobremesas = {
    upcoming: sobremesas.filter(
      (s) => !formatDate(s.date_time).isPast && s.status !== "cancelled"
    ),
    past: sobremesas.filter(
      (s) => formatDate(s.date_time).isPast || s.status === "completed"
    ),
  };

  return (
    <>
      <NavigationMenu />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mis sobremesas</h1>
            <p className="text-muted-foreground">
              Sobremesas donde participás o convocás
            </p>
          </div>
          <Link to="/sobremesa/nueva">
            <Button>Proponer nueva sobremesa</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Cargando...</p>
        ) : sobremesas.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                Todavía no participás de ninguna sobremesa
              </p>
              <div className="space-x-4">
                <Link to="/cartelera">
                  <Button variant="outline">Ir a la cartelera</Button>
                </Link>
                <Link to="/sobremesa/nueva">
                  <Button>Proponer una sobremesa</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Sobremesas */}
            {groupedSobremesas.upcoming.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Próximas</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {groupedSobremesas.upcoming.map((sobremesa) => {
                    const { formatted } = formatDate(sobremesa.date_time);
                    const isConvocante = sobremesa.my_role === "convocante";

                    return (
                      <Card key={sobremesa._id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg line-clamp-2">
                              {sobremesa.title}
                            </CardTitle>
                            {isConvocante && (
                              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Convocante
                              </span>
                            )}
                          </div>
                          <CardDescription className="text-xs">
                            {!isConvocante && (
                              <>
                                Convoca: {sobremesa.convocante_id.name}
                                <br />
                              </>
                            )}
                            {getStatusLabel(sobremesa.status)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span className="text-xs">{formatted}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span className="text-xs">
                                {sobremesa.max_participants} personas
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="gap-2 flex-col">
                          {sobremesa.meeting_link && (
                            <a
                              href={sobremesa.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full"
                            >
                              <Button className="w-full" size="sm">
                                <Video className="h-4 w-4 mr-2" />
                                Entrar a la sala
                              </Button>
                            </a>
                          )}
                          <div className="flex gap-2 w-full">
                            {isConvocante && sobremesa.status === "proposed" && (
                              <Link
                                to={`/sobremesa/${sobremesa._id}/seleccionar`}
                                className="flex-1"
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                >
                                  <Settings className="h-3 w-3 mr-1" />
                                  Gestionar
                                </Button>
                              </Link>
                            )}
                            <Link
                              to={`/sobremesa/${sobremesa._id}`}
                              className="flex-1"
                            >
                              <Button variant="outline" size="sm" className="w-full">
                                Detalles
                              </Button>
                            </Link>
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past Sobremesas */}
            {groupedSobremesas.past.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Pasadas</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {groupedSobremesas.past.map((sobremesa) => {
                    const { formatted } = formatDate(sobremesa.date_time);
                    const isConvocante = sobremesa.my_role === "convocante";

                    return (
                      <Card key={sobremesa._id} className="opacity-75">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg line-clamp-2">
                              {sobremesa.title}
                            </CardTitle>
                            {isConvocante && (
                              <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                Convocante
                              </span>
                            )}
                          </div>
                          <CardDescription className="text-xs">
                            {!isConvocante && (
                              <>
                                Convoca: {sobremesa.convocante_id.name}
                                <br />
                              </>
                            )}
                            {formatted}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Link
                            to={`/sobremesa/${sobremesa._id}`}
                            className="w-full"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full"
                            >
                              Ver detalles
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
