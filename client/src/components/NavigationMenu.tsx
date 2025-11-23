"use client";

import { useState } from "react";
import { Link } from "react-router";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth";

const navItems = [
  { name: "Cartelera", href: "/cartelera" },
  { name: "Mis sobremesas", href: "/mis-sobremesas", protected: true },
];

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout({
      finallyCallback: () => {
        window.location.href = "/cartelera";
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b mb-4 bg-stone-50">
      <div className="flex h-14 items-center p-4">
        <div className="mr-4 hidden md:flex">
          <Link to={"/cartelera"} className="mr-6 flex items-center space-x-2">
            <span className="text-2xl">🍷</span>
            <span className="hidden font-bold sm:inline-block">Sobremesa</span>
          </Link>

          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems
              .filter((item) => !item.protected || user)
              .map((item) => (
                <Link
                  key={item.href}
                  to={{ pathname: item.href }}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  {item.name}
                </Link>
              ))}
          </nav>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link
              to="/cartelera"
              className="flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-2xl mr-2">🍷</span>
              <span className="font-bold">Sobremesa</span>
            </Link>
            <nav className="mt-4 flex flex-col space-y-2">
              {navItems
                .filter((item) => !item.protected || user)
                .map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block px-2 py-1 text-lg text-foreground/60"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center gap-2">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Crear cuenta</Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.photo} alt={user.name} />
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/mis-sobremesas" className="w-full cursor-pointer">
                      Mis sobremesas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
