// routes/scrum/project/project-layout.tsx
import {
    Link,
  NavLink,
  Outlet,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { BarChart3, ClipboardList, KanbanSquare } from "lucide-react";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { extractInitials } from "~/lib/employee-initials";
import { projectService } from "~/services/scrum/project-service";
import { EmployeesAvatarStack } from "~/components/project-nav/avatars-stack";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  if (!id) throw new Response("Missing project id", { status: 400 });

  const project = await projectService.getById(id);
  return { project };
}

const tabs = [
  { to: "avances", label: "Avances", icon: BarChart3 },
  { to: "backlog", label: "Backlog", icon: ClipboardList },
  { to: "sprints", label: "Sprints", icon: ClipboardList },
  { to: "tablero", label: "Tablero", icon: KanbanSquare },
];
const MAX_VISIBLE = 5;

export default function ProjectLayout() {
  const { project } = useLoaderData<typeof loader>();
const visibleEmployees = project.employees.slice(0, MAX_VISIBLE);
const extraCount = project.employees.length - visibleEmployees.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header tipo JIRA */}
{/* Header tipo JIRA */}
<div className="flex flex-col gap-2">
  <span className="text-sm text-muted-foreground">Proyectos</span>

  {/* Título */}
  <Link
    to={`/projects/${project.id}`}
    className="w-fit"
  >
    <h1 className="text-2xl font-semibold tracking-tight hover:underline">
      {project.name}
    </h1>
  </Link>

  {/* Avatares debajo del título, alineados a la izquierda */}
  <EmployeesAvatarStack
    employees={project.employees}
    maxVisible={5}
    size="md"
  />
</div>


      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                isActive && "bg-muted text-foreground"
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
      <Outlet />
    </div>
  );
}
