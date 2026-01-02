import { useNavigate } from "react-router";
import {
  BanknoteArrowUp,
  Ellipsis,
  Pencil,
  UserCheck,
  UserMinus,
  UserX,
  Wallet,
  History,
} from "lucide-react";

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

  const goToHistory = () =>
    navigate(`/employees/history?searchTerm=${cui}`);

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
        {/* HISTORIAL LABORAL — siempre disponible */}
        <DropdownMenuItem onClick={goToHistory}>
          <History className="mr-2 h-4 w-4" />
          Historial laboral
        </DropdownMenuItem>

        {/* Si está TERMINATED, no mostrar nada más */}
        {isTerminated ? null : (
          <>
            <DropdownMenuSeparator />

            {/* Solo ACTIVE */}
            {isActive && (
              <>
                <DropdownMenuItem
                  onClick={() => navigate(`/employees/${id}/edit`)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar datos personales
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate(`/employees/${cui}/salary/increase`)}
                >
                  <BanknoteArrowUp className="mr-2 h-4 w-4" />
                  Aumentar salario
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate(`/employees/${cui}/pay`)}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Realizar pago
                </DropdownMenuItem>
              </>
            )}

            {/* Cambios de estado */}
            {isActive && (
              <DropdownMenuItem
                onClick={() => navigate(`/employees/${cui}/suspend`)}
              >
                <UserX className="mr-2 h-4 w-4" />
                Suspender
              </DropdownMenuItem>
            )}

            {isSuspended && (
              <DropdownMenuItem
                onClick={() => navigate(`/employees/${cui}/reinstate`)}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Reincorporar
              </DropdownMenuItem>
            )}

            {(isActive || isSuspended) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() =>
                    navigate(`/employees/${cui}/terminate`)
                  }
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  Terminar
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
