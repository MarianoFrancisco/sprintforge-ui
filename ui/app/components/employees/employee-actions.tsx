import { useNavigate } from "react-router";
import { Ellipsis } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

import type { EmployeeResponseDTO } from "~/types/employees/employee";

interface EmployeeActionsProps {
  employee: EmployeeResponseDTO;
}

export function EmployeeActions({ employee }: EmployeeActionsProps) {
  const navigate = useNavigate();
  const { id, cui, status } = employee;

  const isActive = status === "ACTIVE";
  const isSuspended = status === "SUSPENDED";
  const isTerminated = status === "TERMINATED";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isTerminated}
          className="data-[state=open]:bg-muted text-muted-foreground"
        >
          <Ellipsis />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        {/* Siempre permitido */}
        {/* <DropdownMenuItem onClick={() => navigate(`/employees/${cui}`)}>
          Ver detalle
        </DropdownMenuItem> */}

        {/* Solo ACTIVE */}
        {isActive && (
          <>
            <DropdownMenuItem
              onClick={() => navigate(`/employees/${id}/edit`)}
            >
              Editar datos personales
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => navigate(`/employees/${cui}/salary/increase`)}
            >
              Aumentar salario
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        {/* Cambios de estado */}
        {isActive && (
          <DropdownMenuItem
            onClick={() => navigate(`/employees/${employee.cui}/suspend`)}
          >
            Suspender
          </DropdownMenuItem>
        )}

        {isSuspended && (
          <DropdownMenuItem
            onClick={() => navigate(`/employees/${employee.cui}/reinstate`)}
          >
            Reincorporar
          </DropdownMenuItem>
        )}

        {(isActive || isSuspended) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() =>
                navigate(`/employees/${employee.cui}/terminate`)
              }
            >
              Terminar
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
