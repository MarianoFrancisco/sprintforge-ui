import { Form, useNavigate } from "react-router"
import { Ellipsis, Eye, Lock, Unlock, Trash2, BanknoteArrowUp } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Button } from "~/components/ui/button"
import type { ProjectResponseDTO } from "~/types/scrum/project"

interface ProjectActionsProps {
  project: ProjectResponseDTO
}

export function ProjectActions({ project }: ProjectActionsProps) {
  const navigate = useNavigate()
  const { id, isClosed } = project

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

      <DropdownMenuContent align="end" className="w-48">
        {/* Ver proyecto */}
        <DropdownMenuItem onClick={() => navigate(`/projects/${id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* Abrir / Cerrar */}
        {isClosed ? (
          <Form method="post" action={`/projects/${id}/open`}>
            <DropdownMenuItem asChild>
              <button type="submit" className="flex w-full items-center">
                <Unlock className="mr-2 h-4 w-4" />
                Abrir proyecto
              </button>
            </DropdownMenuItem>
          </Form>
        ) : (
          <>
                      <DropdownMenuItem
              onClick={() => navigate(`/projects/${id}/payment`)}
            >
              <BanknoteArrowUp className="mr-2 h-4 w-4" />
              Abonar pago
            </DropdownMenuItem>

          <Form method="post" action={`/projects/${id}/close`}>
            <DropdownMenuItem asChild>
              <button type="submit" className="flex w-full items-center">
                <Lock className="mr-2 h-4 w-4" />
                Cerrar proyecto
              </button>
            </DropdownMenuItem>
          </Form>
          </>
        )}

        {/* <DropdownMenuSeparator /> */}

        {/* Eliminar
        <Form method="post" action={`/projects/${id}/delete`}>
          <DropdownMenuItem variant="destructive" asChild>
            <button
              type="submit"
              className="flex w-full items-center text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </button>
          </DropdownMenuItem>
        </Form> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
