import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "~/components/common/data-table";
import { DataTableColumnHeader } from "~/components/common/data-table-column-header";
import { Badge } from "~/components/ui/badge";
import type { UserResponseDTO } from "~/types/identity/user";
import { UserActions } from "./user-actions";

interface UsersTableProps {
  data: UserResponseDTO[];
}

function StatusBadge({ status }: { status: UserResponseDTO["status"] }) {
  return (
    <Badge variant="secondary">
      {status}
    </Badge>
  );
}

export function UsersTable({ data }: UsersTableProps) {
  const columns: ColumnDef<UserResponseDTO>[] = [
    // Username
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Usuario" />
      ),
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
    },

    // Email
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {getValue() as string}
        </span>
      ),
    },

    // Rol
    {
      id: "role",
      accessorFn: (row) => row.role?.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rol" />
      ),
      cell: ({ getValue }) => (
        <Badge variant="secondary">{(getValue() as string) || "—"}</Badge>
      ),
    },

    // Status
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ getValue }) => (
        <StatusBadge status={getValue() as UserResponseDTO["status"]} />
      ),
    },

    // Acciones (opcional)
    {
      id: "actions",
      header: () => <span>Acciones</span>,
      cell: ({ row }) => <UserActions user={row.original} />,
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={10}
      emptyMessage="No se encontraron usuarios"
    />
  );
}
