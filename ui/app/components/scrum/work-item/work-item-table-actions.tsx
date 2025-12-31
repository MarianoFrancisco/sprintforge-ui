// ~/components/scrum/work-item/work-item-table-actions.tsx
import { Form, useNavigate } from "react-router"
import {
  Ellipsis,
  Trash2,
  ArrowRightToLine,
  ArrowLeftToLine,
  UserPlus,
  UserMinus,
  Eye,
} from "lucide-react"

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
 * - Ver (modal)
 * - Mover a Sprint (modal)
 * - Mover a Backlog (POST)
 * - Asignar/Desasignar Developer (modal)
 * - Asignar/Desasignar Product Owner (modal)
 * - Eliminar (POST)
 */
export function WorkItemTableActions({ workItem }: WorkItemTableActionsProps) {
  const navigate = useNavigate()
  const { id, sprint, developerId, productOwnerId } = workItem

  const inSprint = Boolean(sprint?.id)
  const hasDeveloper = Boolean(developerId)
  const hasProductOwner = Boolean(productOwnerId)

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

      <DropdownMenuContent align="end" className="w-56">
        {/* Ver */}
        <DropdownMenuItem onClick={() => navigate(`work-items/${id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Mover a Sprint */}
        <DropdownMenuItem onClick={() => navigate(`work-items/${id}/move-to-sprint`)}>
          <ArrowRightToLine className="mr-2 h-4 w-4" />
          {inSprint ? "Cambiar sprint" : "Mover a sprint"}
        </DropdownMenuItem>

        {/* Mover a Backlog */}
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

        {/* Developer */}
        {hasDeveloper ? (
          <DropdownMenuItem onClick={() => navigate(`work-items/${id}/unassign/developer`)}>
            <UserMinus className="mr-2 h-4 w-4" />
            Desasignar developer
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => navigate(`work-items/${id}/assign/developer`)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Asignar developer
          </DropdownMenuItem>
        )}

        {/* Product Owner */}
        {hasProductOwner ? (
          <DropdownMenuItem onClick={() => navigate(`work-items/${id}/unassign/product-owner`)}>
            <UserMinus className="mr-2 h-4 w-4" />
            Desasignar product owner
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => navigate(`work-items/${id}/assign/product-owner`)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Asignar product owner
          </DropdownMenuItem>
        )}

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
