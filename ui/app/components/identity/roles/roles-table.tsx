// ~/components/roles/roles-table.tsx
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "~/components/common/data-table";
import { DataTableColumnHeader } from "~/components/common/data-table-column-header";
import { Badge } from "~/components/ui/badge";
import type { RoleResponseDTO } from "~/types/identity/role";
import { RoleActions } from "./role-actions";

interface RolesTableProps {
  data: RoleResponseDTO[];
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? "Activo" : "Desactivado"}
    </Badge>
  );
}

export function RolesTable({ data }: RolesTableProps) {
  const columns: ColumnDef<RoleResponseDTO>[] = [
    // Nombre
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
      cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>,
    },

    // Descripción
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descripción" />
      ),
      cell: ({ getValue }) => {
        const value = (getValue() as string) || "";
        return <span className="truncate">{value || "—"}</span>;
      },
    },

    // Status
    {
      id: "status",
      accessorFn: (row) => row.isActive,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
    },

    // Permisos (total)
    {
      id: "permissionsCount",
      accessorFn: (row) => row.permissions?.length ?? 0,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Permisos" />
      ),
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">{Number(getValue() ?? 0)}</span>
      ),
    },

    // Acciones
    {
      id: "actions",
      header: () => <span>Acciones</span>,
      cell: ({ row }) => <RoleActions role={row.original} />,
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={10}
      emptyMessage="No se encontraron roles"
    />
  );
}
