// ~/components/scrum/backlog/backlog.tsx
import { Link } from "react-router"
import { Plus, Rocket } from "lucide-react"

import { Button } from "~/components/ui/button"
import type { WorkItemResponseDTO } from "~/types/scrum/work-item"
import { useProject } from "~/hooks/use-project"
import { WorkItemsTable } from "../../work-item/work-item-table"

interface BacklogProps {
  workItems: WorkItemResponseDTO[]
}

export function Backlog({ workItems }: BacklogProps) {
  const { project } = useProject()

  if (!project) return null

  return (
    <section className="space-y-4">
      {/* Header estilo JIRA (solo acciones) */}
<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
  <h2 className="text-xl font-semibold tracking-tight">Backlog</h2>

  {/* Acciones */}
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center md:justify-end">
    <Button
      asChild
      variant="outline"
      size="sm"
      className="gap-2 w-full sm:w-auto"
    >
      <Link relative="route" to={`create`}>
        <Rocket className="h-4 w-4" />
        Crear sprint
      </Link>
    </Button>

    <Button
      asChild
      size="sm"
      className="gap-2 w-full sm:w-auto"
    >
      <Link to={`/projects/${project.id}/work-items/create`}>
        <Plus className="h-4 w-4" />
        Agregar historia
      </Link>
    </Button>
  </div>
</div>


      {/* Tabla de historias en backlog */}
      <div className="rounded-lg border bg-background">
        <div className="border-b px-4 py-2">
          <p className="text-sm font-medium">
            Historias en backlog
            <span className="ml-2 text-muted-foreground">
              ({workItems.length})
            </span>
          </p>
        </div>

        <div className="p-4">
          <WorkItemsTable data={workItems} />
        </div>
      </div>
    </section>
  )
}
