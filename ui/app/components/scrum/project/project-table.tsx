import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "~/components/common/data-table"
import { DataTableColumnHeader } from "~/components/common/data-table-column-header"
import { MoneyCell } from "~/components/common/money-cell"
import { Badge } from "~/components/ui/badge"
import type { ProjectResponseDTO } from "~/types/scrum/project"
import { ProjectActions } from "./project-actions"

interface ProjectsTableProps {
  data: ProjectResponseDTO[]
}

function StatusBadge({ isClosed }: { isClosed: boolean }) {
  return (
    <Badge variant={isClosed ? "secondary" : "default"}>
      {isClosed ? "Cerrado" : "Abierto"}
    </Badge>
  )
}

export function ProjectsTable({ data }: ProjectsTableProps) {
  const columns: ColumnDef<ProjectResponseDTO>[] = [
    // Key
    {
      accessorKey: "projectKey",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Key" />
      ),
      cell: ({ getValue }) => (
        <span className="font-mono text-sm font-semibold">
          {getValue() as string}
        </span>
      ),
    },

    // Nombre
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre" />
      ),
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
    },

    // Cliente
    {
      accessorKey: "client",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cliente" />
      ),
      cell: ({ getValue }) => {
        const value = (getValue() as string) || ""
        return <span className="truncate">{value || "—"}</span>
      },
    },

    // Área
    {
      accessorKey: "area",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Área" />
      ),
      cell: ({ getValue }) => {
        const value = (getValue() as string) || ""
        return <span className="truncate">{value || "—"}</span>
      },
    },

    // Presupuesto
    {
      accessorKey: "budgetAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Presupuesto" />
      ),
      cell: ({ getValue }) => (
        <MoneyCell value={Number(getValue())} />
      ),
    },

    // Monto contrato
    {
      accessorKey: "contractAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contrato" />
      ),
      cell: ({ getValue }) => (
        <MoneyCell value={Number(getValue())} />
      ),
    },

    // Status (Abierto / Cerrado)
    {
      id: "status",
      accessorFn: (row) => row.isClosed,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => (
        <StatusBadge isClosed={row.original.isClosed} />
      ),
    },

    // Acciones (opcional, cuando lo necesites)
    {
      id: "actions",
      header: () => <span>Acciones</span>,
      cell: ({ row }) => <ProjectActions project={row.original} />,
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={10}
      emptyMessage="No se encontraron proyectos"
    />
  )
}
