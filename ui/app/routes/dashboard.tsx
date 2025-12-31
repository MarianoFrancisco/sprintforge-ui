import { useUser } from "~/hooks/use-user";
import type { Route } from "./+types/dashboard";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Sprint Forge" },
  ];
}

export default function DashboardPage() {
  const { user } = useUser();

  return (
      <main className="container px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Tarjeta de bienvenida */}
          <Card className="text-center">
            <CardHeader className="pb-6">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-primary/10">
                  <img 
                    src="/logo.svg" 
                    alt="Sprint Forge Logo" 
                    className="h-16 w-16" 
                  />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight">
                ¡Bienvenido a Sprint Forge!
              </h1>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <p className="text-muted-foreground mb-2">
                  Has iniciado sesión como
                </p>
                <p className="text-2xl font-semibold text-primary">
                  {user.fullname}
                </p>
              </div>

              <div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {user.role}
                </Badge>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Listo para comenzar tu próximo proyecto
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
  );
}