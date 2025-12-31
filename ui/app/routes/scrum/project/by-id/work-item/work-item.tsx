// routes/scrum/project/by-id/work-item/work-item.tsx
import * as React from "react"
import {
  data,
  type LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router"

import { workItemService } from "~/services/scrum/work-item-service"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Badge } from "~/components/ui/badge"
import type { WorkItemResultResponseDTO } from "~/types/scrum/work-item"
import { PriorityBadge } from "~/components/scrum/work-item/priority-badge"
import { EmployeeChip } from "~/components/scrum/project/employee-chip"

export function meta() {
  return [{ title: "Detalle de historia de usuario" }]
}

type LoaderData = {
  workItem: WorkItemResultResponseDTO
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { workItemId } = params
  if (!workItemId) throw new Error("workItemId no proporcionado")

  const workItem = await workItemService.getById(workItemId)
  return data<LoaderData>({ workItem })
}

function toChipEmployee(emp: WorkItemResultResponseDTO["developerId"]) {
  if (!emp) return null
  return {
    id: emp.id,
    email: emp.email,
    fullName: emp.fullName,
    profileImage: emp.profileImage ?? null,
  }
}

export default function WorkItemDialogRoute() {
  const { workItem } = useLoaderData<typeof loader>() as LoaderData
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-2">
            <span className="text-xl font-semibold">{workItem.title}</span>

            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={workItem.priority} />
              {typeof workItem.storyPoints === "number" ? (
                <Badge variant="secondary">{workItem.storyPoints} pts</Badge>
              ) : (
                <Badge variant="secondary">Sin puntos</Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Descripción */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Descripción</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {workItem.description?.trim() ? workItem.description : "—"}
            </p>
          </section>

          {/* Criterios de aceptación */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Criterios de aceptación</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {workItem.acceptanceCriteria?.trim()
                ? workItem.acceptanceCriteria
                : "—"}
            </p>
          </section>

          {/* Asignaciones */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Asignaciones</h3>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">Developer</p>
                {workItem.developerId ? (
                  <EmployeeChip
                    employee={toChipEmployee(workItem.developerId)!}
                    showRemoveButton={false}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">Product Owner</p>
                {workItem.productOwnerId ? (
                  <EmployeeChip
                    employee={toChipEmployee(workItem.productOwnerId)!}
                    showRemoveButton={false}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
