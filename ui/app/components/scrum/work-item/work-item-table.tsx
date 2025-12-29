// ~/components/scrum/work-items/work-items-table.tsx
import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "~/components/common/data-table"
import { DataTableColumnHeader } from "~/components/common/data-table-column-header"
import { Badge } from "~/components/ui/badge"
import type { WorkItemResponseDTO } from "~/types/scrum/work-item"
import { WorkItemTableActions } from "./work-item-table-actions"

interface WorkItemsTableProps {
  data: WorkItemResponseDTO[]
}

function PriorityBadge({ priority }: { priority: number }) {
  // Ajusta textos si tu priority tiene significado (1=Alta, etc.)
  return (
    <Badge variant="outline" className="font-mono text-xs">
      P{priority}
    </Badge>
  )
}

export function WorkItemsTable({ data }: WorkItemsTableProps) {
  const columns: ColumnDef<WorkItemResponseDTO>[] = [
    // STORY POINTS (pequeño)
    {
      id: "storyPoints",
      accessorFn: (row) => row.storyPoints,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SP" />
      ),
      cell: ({ row }) => {
        const sp = row.original.storyPoints
        return (
          <span className="w-10 text-left font-mono text-sm tabular-nums">
            {sp === null || sp === undefined ? "—" : sp}
          </span>
        )
      },
      enableSorting: true,
      meta: { className: "w-[72px] whitespace-nowrap" },
    },

    // PRIORITY (pequeño)
    {
      id: "priority",
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prioridad" />
      ),
      cell: ({ getValue }) => (
        <div className="w-[84px] whitespace-nowrap text-left">
          <PriorityBadge priority={Number(getValue() ?? 0)} />
        </div>
      ),
      enableSorting: true,
      meta: { className: "w-[110px]" },
    },

    // COLUMNA / ESTADO DEL BOARD (pequeño)
    {
      id: "boardColumn",
      accessorFn: (row) => row.boardColumn?.name ?? "",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Columna" />
      ),
      cell: ({ row }) => {
        const name = row.original.boardColumn?.name
        return (
          <div className="w-40 whitespace-nowrap text-left">
            {name ? <Badge variant="secondary">{name}</Badge> : <span>—</span>}
          </div>
        )
      },
      enableSorting: true,
      meta: { className: "w-[180px]" },
    },

    // TÍTULO (que llene el resto)
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Título" />
      ),
      cell: ({ getValue }) => (
        <span className="block min-w-0 truncate font-medium">
          {getValue() as string}
        </span>
      ),
      meta: { className: "w-full" },
    },

    // ACTIONS
    {
      id: "actions",
      header: () => <span>Acciones</span>,
      cell: ({ row }) => <WorkItemTableActions workItem={row.original} />,
      meta: { className: "w-[72px] text-right" },
      enableSorting: false,
      enableHiding: false,
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={10}
      emptyMessage="No se encontraron historias de usuario"
    />
  )
}
