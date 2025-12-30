// ~/routes/projects/$projectId/board/layout.tsx
import {
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
  type MiddlewareFunction,
} from "react-router"
import { boardMiddleware } from "~/middlewares/board-middleware"
import { boardContext } from "~/context/board-context"
import { projectContext } from "~/context/project-context"
import { Button } from "~/components/ui/button"
import { SprintSelector } from "~/components/board/sprint-selector"
import { Plus } from "lucide-react"

export const middleware: MiddlewareFunction[] = [
  boardMiddleware({ flashMessage: "No se pudo cargar el tablero." }),
]

export async function loader({ context, params }: LoaderFunctionArgs) {
  const boardCtx = context.get(boardContext)
  const projectCtx = context.get(projectContext)
  if (!projectCtx || !boardCtx) throw redirect("/")

  const sprintId = params.sprintId
  if (!sprintId) throw redirect("/")

  const sprint = projectCtx.sprints.find((s) => s.id === sprintId)
  if (!sprint) throw redirect("/")

  return {
    boardColumns: boardCtx.boardColumns,
    project: projectCtx.project,
    sprints: projectCtx.sprints,
    sprintId,
    sprintName: sprint.name,
  }
}

export default function BoardLayout() {
  const navigate = useNavigate()
  const { project, sprints, sprintId, sprintName } =
    useLoaderData<typeof loader>()

  return (
    // 1) overflow-x-hidden evita que el layout completo “se ensanche”
    // 2) min-w-0 permite que truncates y flex funcionen correctamente
        <section className="min-w-0 px-4 py-4 md:px-6 md:py-6">
      {/* Header sticky para que el botón no se pierda */}
       <div className="sticky top-0 z-10 -mx-4 px-4 md:-mx-6 md:px-6 pb-3 bg-background">
        <section className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-lg font-semibold truncate">{sprintName}</h1>

            <SprintSelector
              value={sprintId}
              options={sprints.map((s) => ({ value: s.id, label: s.name }))}
              onChange={(nextSprintId) => {
                navigate(`/projects/${project.id}/board/${nextSprintId}`)
              }}
            />
          </div>

          {/* botón siempre visible (no se encoge) */}
          <Link to={`/projects/${project.id}/board/${sprintId}/create-column`} className="shrink-0">
            <Button type="button" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar columna
            </Button>
          </Link>
        </section>
      </div>

      {/* Contenido del board */}
     <div className="min-w-0">
        <Outlet />
      </div>
    </section>
  )
}
