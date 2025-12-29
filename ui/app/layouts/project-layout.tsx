import {
  Link,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  type LoaderFunctionArgs,
  type MiddlewareFunction,
} from "react-router";
import { BarChart3, ClipboardList, KanbanSquare } from "lucide-react";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";

import { EmployeesAvatarStack } from "~/components/project-nav/avatars-stack";
import type { ProjectOutletContext } from "~/hooks/use-project";
import { projectMiddleware } from "~/middlewares/project-middleware";
import { projectContext } from "~/context/project-context";

export const middleware: MiddlewareFunction[] = [
  projectMiddleware({ flashMessage: "Proyecto no encontrado o sin acceso." }),
];

export async function loader({ context }: LoaderFunctionArgs) {
  const projectCtx = context.get(projectContext); // ahora es ProjectTypeContext
  if (!projectCtx) throw redirect("/");
  return projectCtx; // { project, sprints }
}

const tabs = [
  // { to: "avances", label: "Avances", icon: BarChart3 },
  { to: "backlog", label: "Backlog", icon: ClipboardList },
  // { to: "sprints", label: "Sprints", icon: ClipboardList },
  { to: "board", label: "Tablero", icon: KanbanSquare },
];

export default function ProjectLayout() {
  const BASE_PROJECTS_PATH = "/projects";
  const { project, sprints } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4">
      {/* Header tipo JIRA */}
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Proyectos</span>

        {/* Título */}
        <Link to={`/projects/${project.id}`} className="w-fit">
          <h1 className="text-2xl font-semibold tracking-tight hover:underline">
            {project.name}
          </h1>
        </Link>

        {/* Avatares debajo del título, alineados a la izquierda */}
        <EmployeesAvatarStack employees={project.employees} size="md" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={`${BASE_PROJECTS_PATH}/${project.id}/${to}`}
            end
            className={({ isActive }) =>
              cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                isActive && "bg-muted text-foreground",
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>

      <Separator />

      {/* Contenido de la pestaña */}
      <Outlet context={{ project, sprints } satisfies ProjectOutletContext} />
    </div>
  );
}
