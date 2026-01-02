// ~/components/scrum/project/project-employee-actions.tsx
import { useNavigate } from "react-router"
import { UserCog, UserPlus, UserMinus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Button } from "~/components/ui/button"

interface ProjectEmployeeActionsProps {
  projectId: string
  assignedCount: number
}

export function ProjectEmployeeActions({
  projectId,
  assignedCount,
}: ProjectEmployeeActionsProps) {
  const navigate = useNavigate()

  const canUnassign = assignedCount > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full data-[state=open]:bg-muted text-muted-foreground"
          aria-label="Gestionar empleados del proyecto"
        >
          <UserCog className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        {/* Asignar empleados */}
        <DropdownMenuItem
          onClick={() =>
            navigate(`/projects/${projectId}/assign-employees`)
          }
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Asignar empleados
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Desasignar empleados */}
        <DropdownMenuItem
          disabled={!canUnassign}
          onClick={() =>
            navigate(`/projects/${projectId}/unassign-employees`)
          }
        >
          <UserMinus className="mr-2 h-4 w-4" />
          Desasignar empleados
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
