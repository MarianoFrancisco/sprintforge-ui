import { Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useNavigate } from "react-router";

interface ErrorPageProps {
  title: string;
  message: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export function ErrorPage({
  title,
  message,
  showBackButton = true,
  showHomeButton = true,
}: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full text-center border-border/50 shadow-md">
        <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-destructive/10 text-destructive rounded-full p-4">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </CardHeader>

        <Separator className="my-4" />

        <CardContent className="flex flex-col sm:flex-row justify-center gap-2">
          {showHomeButton && (
            <Button onClick={() => navigate("/")} className="gap-2">
              <Home className="w-4 h-4" />
              Ir al inicio
            </Button>
          )}
          {showBackButton && (
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver atrás
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
