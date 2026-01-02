// routes/scrum/project/by-id/sprints/sprint.tsx
import * as React from "react"
import {
  data,
  type LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router"

import { sprintService } from "~/services/scrum/sprint-service"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Badge } from "~/components/ui/badge"

import type { SprintResponseDTO } from "~/types/scrum/sprint"

// date-fns
import { formatDistanceToNow, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export function meta() {
  return [{ title: "Detalle de sprint" }]
}

type LoaderData = {
  sprint: SprintResponseDTO
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { sprintId } = params
  if (!sprintId) throw new Error("sprintId no proporcionado")

  const sprint = await sprintService.getById(sprintId)
  return data<LoaderData>({ sprint })
}

function formatInstant(iso: string | null | undefined) {
  if (!iso) return "—"
  const d = parseISO(iso)
  if (Number.isNaN(d.getTime())) return "—"
  // Ej: "hace 3 días"
  return formatDistanceToNow(d, { addSuffix: true, locale: es })
}

function toStatusLabel(status: SprintResponseDTO["status"]) {
  // Ajusta si tus valores reales son distintos
  const map: Record<string, string> = {
    CREATED: "Creado",
    STARTED: "Iniciado",
    COMPLETED: "Completado",
  }
  return map[status] ?? status
}

export default function SprintDialogRoute() {
  const { sprint } = useLoaderData<typeof loader>() as LoaderData
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(true)

  function onClose() {
    try {
      navigate(-1)
    } catch {
      navigate("/")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) onClose()
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">
              Proyecto: <span className="font-medium text-foreground">{sprint.project.name}</span>
            </span>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xl font-semibold">{sprint.name}</span>
              <Badge variant="secondary">{toStatusLabel(sprint.status)}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Goal */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Meta</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {sprint.goal?.trim() ? sprint.goal : "—"}
            </p>
          </section>

          {/* Fechas */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Fechas</h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Fecha de inicio</p>
                <p className="text-sm font-medium">{formatInstant(sprint.startDate)}</p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Fecha de fin</p>
                <p className="text-sm font-medium">{formatInstant(sprint.endDate)}</p>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
