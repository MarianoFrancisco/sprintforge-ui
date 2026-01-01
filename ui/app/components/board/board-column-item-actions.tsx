// ~/components/scrum/board/board-column-item-actions.tsx
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
import type { BoardColumnItemUI } from "~/types/scrum/board-column"

interface BoardColumnItemActionsProps {
  item: BoardColumnItemUI
  projectId: string
}

export function BoardColumnItemActions({
  item,
  projectId,
}: BoardColumnItemActionsProps) {
  const navigate = useNavigate()

  const {
    id: workItemId,
    developerId,
    productOwnerId,
  } = item

  const hasDeveloper = Boolean(developerId)
  const hasProductOwner = Boolean(productOwnerId)

  // Base absoluta del proyecto
  const base = `/projects/${projectId}/sprints/work-items/${workItemId}`

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
        <DropdownMenuItem onClick={() => navigate(base)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Mover a Sprint */}
        <DropdownMenuItem onClick={() => navigate(`${base}/move-to-sprint`)}>
          <ArrowRightToLine className="mr-2 h-4 w-4" />
          Mover a sprint
        </DropdownMenuItem>

        {/* Mover a Backlog */}
        <Form method="post" action={`${base}/move-to-backlog`}>
          <DropdownMenuItem asChild>
            <button type="submit" className="flex w-full items-center">
              <ArrowLeftToLine className="mr-2 h-4 w-4" />
              Mover a backlog
            </button>
          </DropdownMenuItem>
        </Form>

        <DropdownMenuSeparator />

        {/* Developer */}
        {hasDeveloper ? (
          <DropdownMenuItem
            onClick={() => navigate(`${base}/unassign/developer`)}
          >
            <UserMinus className="mr-2 h-4 w-4" />
            Desasignar developer
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => navigate(`${base}/assign/developer`)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Asignar developer
          </DropdownMenuItem>
        )}

        {/* Product Owner */}
        {hasProductOwner ? (
          <DropdownMenuItem
            onClick={() => navigate(`${base}/unassign/product-owner`)}
          >
            <UserMinus className="mr-2 h-4 w-4" />
            Desasignar product owner
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => navigate(`${base}/assign/product-owner`)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Asignar product owner
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Eliminar */}
        <Form method="post" action={`${base}/delete`}>
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
