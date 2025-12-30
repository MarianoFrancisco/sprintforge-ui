// ~/components/scrum/sprints/sprint-backlog.tsx
import { Link, useFetcher } from "react-router"
import { CheckCircle2, Play, Plus } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { useProject } from "~/hooks/use-project"

import type { WorkItemResponseDTO, WorkItemSprint } from "~/types/scrum/work-item"
import { WorkItemsTable } from "~/components/scrum/work-item/work-item-table"
import type { SprintStatus } from "~/types/scrum/sprint"
import { SprintActions } from "./sprint-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"

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
  const fetcher = useFetcher()
  const isSubmitting = fetcher.state === "submitting"

  if (!project) return null

  const handleSprintAction = (action: "start" | "complete") => {
    const formData = new FormData()
    formData.append("sprintId", sprint.id)
    formData.append("action", action)
    
    fetcher.submit(formData, {
      method: "POST",
      action: `/projects/${project.id}/sprints/${sprint.id}/${action}`,
    })
  }

  const getPrimaryAction = () => {
    if (sprint.status === "CREATED") {
      return {
        label: "Iniciar sprint",
        icon: Play,
        action: "start",
        dialogTitle: "¿Iniciar sprint?",
        dialogDescription: "Al iniciar el sprint, todas las historias asignadas se marcarán como activas. ¿Estás seguro de que deseas iniciar este sprint?",
        buttonText: "Iniciar",
      }
    }
    
    if (sprint.status === "STARTED") {
      return {
        label: "Completar sprint",
        icon: CheckCircle2,
        action: "complete",
        dialogTitle: "¿Completar sprint?",
        dialogDescription: "Al completar el sprint, todas las historias se marcarán según su estado final. ¿Estás seguro de que deseas completar este sprint?",
        buttonText: "Completar",
      }
    }
    
    return null
  }

  const primaryAction = getPrimaryAction()
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
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to={`/projects/${project.id}/work-items/create/${sprint.id}`}>
              <Plus className="h-4 w-4" />
              Agregar historia
            </Link>
          </Button>

          {primaryAction ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="gap-2"
                  disabled={isSubmitting}
                >
                  {PrimaryIcon ? <PrimaryIcon className="h-4 w-4" /> : null}
                  {isSubmitting ? "Procesando..." : primaryAction.label}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{primaryAction.dialogTitle}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {primaryAction.dialogDescription}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <fetcher.Form 
                  method="POST" 
                  action={`/projects/${project.id}/sprints/${sprint.id}/${primaryAction.action}`}
                >
                  <input type="hidden" name="sprintId" value={sprint.id} />
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSubmitting}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      asChild
                      disabled={isSubmitting}
                    >
                      <button 
                        type="submit" 
                        name="action" 
                        value={primaryAction.action}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      >
                        {isSubmitting ? "Procesando..." : primaryAction.buttonText}
                      </button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </fetcher.Form>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}

          <SprintActions sprint={sprint} />
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