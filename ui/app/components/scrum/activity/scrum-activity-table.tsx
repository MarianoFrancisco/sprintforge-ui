import * as React from "react";
import { MessageSquareText, Clock } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "~/components/common/data-table";
import { DataTableColumnHeader } from "~/components/common/data-table-column-header";

// date-fns
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { ScrumActivityResponseDTO } from "~/types/scrum/scrum-activiy";

interface ScrumActivitiesTableProps {
  data: ScrumActivityResponseDTO[];
}

/** Convierte ISO (Instant) a "hace 5 minutos", etc. */
function humanizeOccurredAt(iso: string) {
  if (!iso) return "—";
  try {
    const date = parseISO(iso); // soporta "2025-12-31T18:25:00Z"
    if (Number.isNaN(date.getTime())) return "—";

    return formatDistanceToNow(date, {
      addSuffix: true, // "hace ..."
      locale: es,
    });
  } catch {
    return "—";
  }
}

export function ScrumActivitiesTable({ data }: ScrumActivitiesTableProps) {
  const columns = React.useMemo<ColumnDef<ScrumActivityResponseDTO>[]>(
    () => [
      // Mensaje
      {
        accessorKey: "message",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Mensaje"
            icon={<MessageSquareText />}
          />
        ),
        cell: ({ getValue }) => (getValue<string>() || "—"),
      },

      // Ocurrió
      {
        accessorKey: "occurredAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Ocurrió" icon={<Clock />} />
        ),
        cell: ({ getValue }) => humanizeOccurredAt(String(getValue() ?? "")),
        // para que el sort siga siendo por fecha real y no por el string "hace..."
        sortingFn: (rowA, rowB, columnId) => {
          const a = rowA.getValue<string>(columnId);
          const b = rowB.getValue<string>(columnId);
          const ta = a ? Date.parse(a) : 0;
          const tb = b ? Date.parse(b) : 0;
          return ta - tb;
        },
      },
    ],
    []
  );

  return <DataTable data={data} columns={columns} pageSize={10} />;
}
