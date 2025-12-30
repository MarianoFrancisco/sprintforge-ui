// ~/routes/projects/$projectId/board/layout.tsx
import {
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
  type MiddlewareFunction,
} from "react-router";
import { boardMiddleware } from "~/middlewares/board-middleware";
import { boardContext } from "~/context/board-context";
import { projectContext } from "~/context/project-context";
import { Button } from "~/components/ui/button";
import { SprintSelector } from "~/components/board/sprint-selector";
import { Plus } from "lucide-react";

export const middleware: MiddlewareFunction[] = [
  boardMiddleware({ flashMessage: "No se pudo cargar el tablero." }),
];

export async function loader({ context, params }: LoaderFunctionArgs) {
  const boardCtx = context.get(boardContext);
  const projectCtx = context.get(projectContext);
  if (!projectCtx || !boardCtx) throw redirect("/");

  const sprintId = params.sprintId;
  if (!sprintId) throw redirect("/");

  const sprint = projectCtx.sprints.find((s) => s.id === sprintId);
  if (!sprint) throw redirect("/");

  return {
    boardColumns: boardCtx.boardColumns,
    project: projectCtx.project,
    sprints: projectCtx.sprints,
    sprintId,
    sprintName: sprint.name,
  };
}

export default function BoardLayout() {
  const navigate = useNavigate();
  const { project, sprints, sprintId, sprintName } = useLoaderData<typeof loader>();

  return (
    <section className="p-4 md:p-6 space-y-4">
      {/* Header del board (sin repetir info del ProjectLayout) */}
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-lg font-semibold truncate">{sprintName}</h1>

          <SprintSelector
            value={sprintId}
            options={sprints.map((s) => ({ value: s.id, label: s.name }))}
            onChange={(nextSprintId) => {
              navigate(`/projects/${project.id}/board/${nextSprintId}`);
            }}
          />
        </div>

        <Button type="button">
            <Plus className="h-4 w-4" />
          Agregar columna
        </Button>
      </header>

      <Outlet />
    </section>
  );
}
