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
import { NavigationMenu } from "@/components/navigationMenu";
import { Calendar, Users, Clock } from "lucide-react";

type Sobremesa = {
  _id: string;
  title: string;
  description: string;
  date_time: string;
  max_participants: number;
  convocante_id: {
    name: string;
    context: string;
    photo?: string;
  };
  status: string;
};

export default function CarteleraPage() {
  const [sobremesas, setSobremesas] = useState<Sobremesa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSobremesas();
  }, []);

  const fetchSobremesas = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/sobremesas/cartelera`,
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
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <NavigationMenu />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cartelera</h1>
            <p className="text-muted-foreground">
              Sobremesas propuestas - sin algoritmos, sin ranking
            </p>
          </div>
          <Link to="/sobremesa/nueva">
            <Button>Proponer sobremesa</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Cargando...</p>
        ) : sobremesas.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No hay sobremesas propuestas todavía.
              </p>
              <Link to="/sobremesa/nueva">
                <Button className="mt-4">Sé el primero en proponer una</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sobremesas.map((sobremesa) => (
              <Card key={sobremesa._id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    {sobremesa.title}
                  </CardTitle>
                  <CardDescription>
                    Convoca: {sobremesa.convocante_id.name}
                    <br />
                    <span className="text-xs">
                      {sobremesa.convocante_id.context}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {sobremesa.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(sobremesa.date_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Busca {sobremesa.max_participants} personas</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/sobremesa/${sobremesa._id}`} className="w-full">
                    <Button className="w-full" variant="outline">
                      Ver detalles y escribir carta
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
