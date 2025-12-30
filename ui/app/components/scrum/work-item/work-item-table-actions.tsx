// ~/components/scrum/work-item/work-item-table-actions.tsx
import { Form, useNavigate } from "react-router"
import { Ellipsis, Trash2, ArrowRightToLine, ArrowLeftToLine } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Button } from "~/components/ui/button"

import type { WorkItemResponseDTO } from "~/types/scrum/work-item"

interface WorkItemTableActionsProps {
  workItem: WorkItemResponseDTO
}

/**
 * Acciones:
 * - Mover a Sprint (abre ruta/modal para seleccionar sprint)
 * - Mover a Backlog (POST)
 * - Eliminar (POST)
 *
 * Nota: Las rutas usadas aquí son sugeridas. Ajusta a tus rutas reales.
 */
export function WorkItemTableActions({ workItem }: WorkItemTableActionsProps) {
  const navigate = useNavigate()
  const { id, sprint } = workItem

  const inSprint = Boolean(sprint?.id)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-muted text-muted-foreground"
        >
          <Ellipsis />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        {/* Mover a Sprint (siempre disponible; si ya está en sprint, es "cambiar sprint") */}
        <DropdownMenuItem
          onClick={() => navigate(`work-items/${id}/move-to-sprint`)}
        >
          <ArrowRightToLine className="mr-2 h-4 w-4" />
          {inSprint ? "Cambiar sprint" : "Mover a sprint"}
        </DropdownMenuItem>

        {/* Mover a Backlog (solo si está en sprint) */}
        {inSprint ? (
          <Form method="post" action={`work-items/${id}/move-to-backlog`}>
            <DropdownMenuItem asChild>
              <button type="submit" className="flex w-full items-center">
                <ArrowLeftToLine className="mr-2 h-4 w-4" />
                Mover a backlog
              </button>
            </DropdownMenuItem>
          </Form>
        ) : null}

        <DropdownMenuSeparator />

        {/* Eliminar */}
        <Form method="post" action={`work-items/${id}/delete`}>
          <DropdownMenuItem variant="destructive" asChild>
            <button type="submit" className="flex w-full items-center">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </button>
          </DropdownMenuItem>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
