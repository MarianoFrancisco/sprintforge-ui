import {
  User,
  Phone,
  Briefcase,
  DollarSign,
  Activity,
  BadgeInfo,
  Ellipsis,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useFetcher, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/common/data-table";
import { StatusBadge } from "~/components/common/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "~/components/common/data-table-column-header";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";

import type { EmployeeResponseDTO } from "~/types/employees/employee";

interface EmployeesTableProps {
  data: EmployeeResponseDTO[];
}

export function EmployeesTable({ data }: EmployeesTableProps) {
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const handleActivation = (id: string, activate: boolean) => {
    fetcher.submit(
      { activate: String(activate) },
      {
        method: "POST",
        action: `/employees/${id}/activation`,
      }
    );
  };

  const handleTermination = (id: string, rehire: boolean) => {
    fetcher.submit(
      { rehire: String(rehire) },
      {
        method: "POST",
        action: `/employees/${id}/termination`,
      }
    );
  };

  const columns: ColumnDef<EmployeeResponseDTO>[] = [
    // CUI
    {
      accessorKey: "cui",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CUI" icon={<BadgeInfo />} />
      ),
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">{getValue() as string}</span>
      ),
    },

    // Fullname + Avatar
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Empleado" icon={<User />} />
      ),
      cell: ({ row }) => {
        const employee = row.original;
        const initials = `${employee.firstName[0] ?? ""}${employee.lastName[0] ?? ""}`;

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              {employee.profileImage ? (
                <AvatarImage src={employee.profileImage} alt={employee.fullName} />
              ) : null}
              <AvatarFallback className="text-xs font-medium">
                {initials.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{employee.fullName}</span>
          </div>
        );
      },
    },

    // Teléfono
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Teléfono" icon={<Phone />} />
      ),
      cell: ({ getValue }) => getValue() || "—",
    },

    // Puesto
    {
      accessorKey: "positionId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Puesto" icon={<Briefcase />} />
      ),
      cell: ({ row }) => row.original.position?.name ?? "—",
    },

    // Salario
    {
      accessorKey: "salary",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Salario" icon={<DollarSign />} />
      ),
      cell: ({ getValue }) => (
        <span className="font-medium">Q {getValue() as number}</span>
      ),
    },

    // Estado
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" icon={<Activity />} />
      ),
      cell: ({ getValue }) => (
        <StatusBadge status={Boolean(getValue())} />
      ),
    },

    // Acciones
    {
      id: "actions",
      header: () => <span>Acciones</span>,
      cell: ({ row }) => {
        const employee = row.original;
        const isActive = employee.isActive;
        const isDeleted = employee.isDeleted;

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
              <DropdownMenuItem
                onClick={() => navigate(`/employees/${employee.id}`)}
              >
                Ver detalle
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate(`/employees/${employee.id}/edit`)}
              >
                Editar datos personales
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleActivation(employee.id, !isActive)}
              >
                {isActive ? "Suspender" : "Activar"}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant={isDeleted ? "default" : "destructive"}
                onClick={() =>
                  handleTermination(employee.id, isDeleted)
                }
              >
                {isDeleted
                  ? "Recontratar"
                  : "Despedir / Registrar renuncia"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <DataTable data={data} columns={columns} pageSize={10} />;
}
