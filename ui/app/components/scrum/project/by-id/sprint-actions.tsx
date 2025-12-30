// ~/components/sprints/sprint-actions.tsx
import { Form } from "react-router"
import { Ellipsis, Play, CheckCircle2, Trash2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Button } from "~/components/ui/button"
import type { WorkItemSprint } from "~/types/scrum/work-item"
import type { SprintStatus } from "~/types/scrum/sprint"

interface SprintActionsProps {
  sprint: WorkItemSprint
}

function canStart(status: SprintStatus) {
  return status === "CREATED"
}

function canClose(status: SprintStatus) {
  return status === "STARTED"
}

export function SprintActions({ sprint }: SprintActionsProps) {
  const { id, status } = sprint

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
        {/* Iniciar */}
        <Form method="post" action={`${id}/start`}>
          <DropdownMenuItem asChild disabled={!canStart(status)}>
            <button type="submit" className="w-full text-left disabled:opacity-50">
              <Play className="mr-2 h-4 w-4" />
              Iniciar
            </button>
          </DropdownMenuItem>
        </Form>

        {/* Cerrar */}
        <Form method="post" action={`${id}/complete`}>
          <DropdownMenuItem asChild disabled={!canClose(status)}>
            <button type="submit" className="w-full text-left disabled:opacity-50">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completar
            </button>
          </DropdownMenuItem>
        </Form>

        <DropdownMenuSeparator />

        {/* Eliminar */}
        <Form method="post" action={`${id}/delete`}>
          <DropdownMenuItem asChild variant="destructive">
            <button
              type="submit"
              className="w-full text-left disabled:opacity-50"
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
