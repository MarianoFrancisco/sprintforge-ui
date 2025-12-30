import { Form, useNavigate } from "react-router"
import { Ellipsis, Pencil, CheckCircle, Ban, Trash2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Button } from "~/components/ui/button"

import type { PositionResponseDTO } from "~/types/employees/position"

interface PositionActionsProps {
  position: PositionResponseDTO
}

export function PositionActions({ position }: PositionActionsProps) {
  const navigate = useNavigate()
  const { id, isActive } = position

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

      <DropdownMenuContent align="end" className="w-44">
        {/* Editar */}
        <DropdownMenuItem onClick={() => navigate(`/employees/positions/${id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>

        {/* Activar / Desactivar */}
        {isActive ? (
          <Form method="post" action={`/employees/positions/${id}/deactivate`}>
            <DropdownMenuItem asChild>
              <button type="submit" className="flex w-full items-center">
                <Ban className="mr-2 h-4 w-4" />
                Desactivar
              </button>
            </DropdownMenuItem>
          </Form>
        ) : (
          <Form method="post" action={`/employees/positions/${id}/activate`}>
            <DropdownMenuItem asChild>
              <button type="submit" className="flex w-full items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Activar
              </button>
            </DropdownMenuItem>
          </Form>
        )}

        <DropdownMenuSeparator />

        {/* Eliminar */}
        <Form method="post" action={`/employees/positions/${id}/delete`}>
          <DropdownMenuItem asChild variant="destructive">
            <button
              type="submit"
              className="flex w-full items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </button>
          </DropdownMenuItem>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
