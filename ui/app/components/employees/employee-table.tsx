import {
  User,
  Phone,
  Briefcase,
  Activity,
  Banknote,
  IdCard,
  Mail,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "~/components/common/data-table";
import { DataTableColumnHeader } from "~/components/common/data-table-column-header";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";

import type { EmployeeResponseDTO, EmployeeStatus } from "~/types/employees/employee";
import { EmployeeActions } from "./employee-actions";
import { formatGTQ } from "~/util/currency-formatter";
import { EmployeeStatusBadge } from "./employee-status-badge";

interface EmployeesTableProps {
  data: EmployeeResponseDTO[];
}

export function EmployeesTable({ data }: EmployeesTableProps) {

  const columns: ColumnDef<EmployeeResponseDTO>[] = [
    // CUI
    {
      accessorKey: "cui",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CUI" icon={<IdCard />} />
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
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Correo Electrónico" icon={<Mail />} />
      ),
      cell: ({ getValue }) => getValue() || "—",
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
        <DataTableColumnHeader column={column} title="Salario" icon={<Banknote />} />
      ),
      cell: ({ getValue }) => (
        formatGTQ(Number(getValue()))
      ),
    },

    // Estado
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Estado"
          icon={<Activity />}
        />
      ),
      cell: ({ getValue }) => (
        <EmployeeStatusBadge status={getValue() as EmployeeStatus} />
      ),
    },

    // Acciones
    {
      id: "actions",
      header: () => <span>Acciones</span>,
      cell: ({ row }) => {
        const employee = row.original;

        return (
          <EmployeeActions employee={employee} />
        );
      },
    },
  ];

  return <DataTable data={data} columns={columns} pageSize={10} />;
}
