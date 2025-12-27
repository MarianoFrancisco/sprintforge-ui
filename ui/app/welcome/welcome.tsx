import { ModeToggle } from "~/components/ui/mode-toggle";
import { Link } from "react-router";
import { Card } from "~/components/ui/card";

export function Welcome({userId}: {userId?: string}) {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <Card className="w-full max-w-3xl p-8 text-center">
        <ModeToggle />
        <div className="flex flex-col items-center gap-6">
          <picture>
            <source srcSet="/logo.svg" media="(prefers-color-scheme: dark)" />
            <img src="/logo.svg" alt="Sprint Forge Logo" className="h-24 w-24" />
          </picture>
          <h1 className="text-3xl font-bold">¡Bienvenido a Sprint Forge!</h1>
          <p className="text-muted-foreground text-balance">
            Tu plataforma integral para la gestión ágil de proyectos. 
            Simplifica la planificación, seguimiento y colaboración en equipo.
          </p>
          {!userId && (
            <Link
              to="/login"
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </Card>
    </main>
  );
}
