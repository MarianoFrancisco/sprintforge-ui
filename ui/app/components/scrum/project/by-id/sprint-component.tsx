// ~/components/scrum/sprints/sprint-backlog.tsx
import { Link } from "react-router"
import { CheckCircle2, Play, Plus } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { useProject } from "~/hooks/use-project"

import type { WorkItemResponseDTO, WorkItemSprint } from "~/types/scrum/work-item"
import { WorkItemsTable } from "~/components/scrum/work-item/work-item-table"
import type { SprintStatus } from "~/types/scrum/sprint"

interface SprintBacklogProps {
  sprint: Pick<WorkItemSprint, "id" | "name" | "status">
  workItems: WorkItemResponseDTO[]
}

function statusLabel(status: SprintStatus) {
  switch (status) {
    case "CREATED":
      return "Creado"
    case "STARTED":
      return "Iniciado"
    case "COMPLETED":
      return "Completado"
    default:
      return status
  }
}

function statusBadgeVariant(status: SprintStatus): "secondary" | "default" | "outline" {
  switch (status) {
    case "STARTED":
      return "default"
    case "CREATED":
      return "secondary"
    case "COMPLETED":
      return "outline"
    default:
      return "secondary"
  }
}

export function SprintBacklog({ sprint, workItems }: SprintBacklogProps) {
  const { project } = useProject()
  if (!project) return null

  const primaryAction =
    sprint.status === "CREATED"
      ? { label: "Iniciar sprint", icon: Play, to: `/projects/${project.id}/sprints/${sprint.id}/start` }
      : sprint.status === "STARTED"
        ? { label: "Completar sprint", icon: CheckCircle2, to: `/projects/${project.id}/sprints/${sprint.id}/complete` }
        : null

  const PrimaryIcon = primaryAction?.icon

  return (
    <section className="space-y-4">
      {/* Header estilo JIRA (nombre de sprint + acciones) */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-xl font-semibold tracking-tight">
              {sprint.name}
            </h2>
            <Badge variant={statusBadgeVariant(sprint.status)}>
              {statusLabel(sprint.status)}
            </Badge>
          </div>
        </div>

        {/* Acciones a la derecha */}
        <div className="flex items-center gap-2">
          {primaryAction ? (
            <Button asChild size="sm" className="gap-2">
              <Link to={primaryAction.to}>
                {PrimaryIcon ? <PrimaryIcon className="h-4 w-4" /> : null}
                {primaryAction.label}
              </Link>
            </Button>
          ) : null}

          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to={`/projects/${project.id}/work-items/create`}>
              <Plus className="h-4 w-4" />
              Agregar historia
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabla de historias del sprint */}
      <div className="rounded-lg border bg-background">
        <div className="border-b px-4 py-2">
          <p className="text-sm font-medium">
            Historias del sprint
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
