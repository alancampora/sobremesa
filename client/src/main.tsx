import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login/index.tsx";
import Singup from "./pages/singup/index.tsx";
import { AuthProvider } from "./context/auth.tsx";
import Landing from "./pages/landing/index.tsx";
import Profile from "./pages/profile/index.tsx";
import ProtectedRoute from "./components/protected-route.tsx";
import Cartelera from "./pages/cartelera/index.tsx";
import NuevaSobremesa from "./pages/sobremesa-nueva/index.tsx";
import SobremesaDetalle from "./pages/sobremesa-detalle/index.tsx";
import SobremesaSeleccionar from "./pages/sobremesa-seleccionar/index.tsx";
import MisSobremesas from "./pages/mis-sobremesas/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/cartelera",
    element: <Cartelera />,
  },
  {
    path: "/sobremesa/nueva",
    element: (
      <ProtectedRoute>
        <NuevaSobremesa />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sobremesa/:id",
    element: <SobremesaDetalle />,
  },
  {
    path: "/sobremesa/:id/seleccionar",
    element: (
      <ProtectedRoute>
        <SobremesaSeleccionar />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mis-sobremesas",
    element: (
      <ProtectedRoute>
        <MisSobremesas />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Singup />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
