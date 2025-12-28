// ~/components/projects/payments/project-payments-table.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { DataTable } from "~/components/common/data-table";
import { DataTableColumnHeader } from "~/components/common/data-table-column-header";
import { MoneyCell } from "~/components/common/money-cell";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { PaymentResponseDTO } from "~/types/scrum/project-payment";

interface ProjectPaymentsTableProps {
  data: PaymentResponseDTO[];
}

function PaymentDetailDialog({
  reference,
  note,
}: {
  reference?: string;
  note?: string;
}) {
  const hasReference = !!reference && reference.trim() !== "";
  const hasNote = !!note && note.trim() !== "";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <Eye className="h-4 w-4 mr-1" />
          Ver detalle
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle del pago</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Referencia */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Referencia</p>
            {hasReference ? (
              <div className="rounded-lg border p-3">
                <p className="font-mono text-sm break-all">{reference}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sin referencia</p>
            )}
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Notas</p>
            {hasNote ? (
              <div className="rounded-lg border p-3">
                <p className="whitespace-pre-wrap text-sm">{note}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tiene notas</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function methodLabel(method: unknown) {
  // Ajusta según tu enum real PaymentMethod
  // Si ya es string, se mostrará tal cual.
  if (typeof method === "string") return method;
  return "—";
}

export function ProjectPaymentsTable({ data }: ProjectPaymentsTableProps) {
  const columns: ColumnDef<PaymentResponseDTO>[] = [
    // KEY (Project Key)
    {
      id: "projectKey",
      accessorFn: (row) => row.project?.projectKey ?? "",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="KEY" />
      ),
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">{(getValue() as string) || "—"}</span>
      ),
    },

    // Nombre (Project name)
    {
      id: "projectName",
      accessorFn: (row) => row.project?.name ?? "",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre" />
      ),
      cell: ({ getValue }) => (
        <span className="truncate">{(getValue() as string) || "—"}</span>
      ),
    },

    // Cliente
    {
      id: "client",
      accessorFn: (row) => row.project?.client ?? "",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cliente" />
      ),
      cell: ({ getValue }) => (
        <span className="truncate">{(getValue() as string) || "—"}</span>
      ),
    },

    // Método de pago
    {
      accessorKey: "method",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Método de pago" />
      ),
      cell: ({ getValue }) => (
        <Badge variant="secondary">{methodLabel(getValue())}</Badge>
      ),
    },

    // Amount
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ getValue }) => (
        <MoneyCell value={Number(getValue() ?? 0)} className="font-semibold" />
      ),
    },

    // Ver detalle (Dialog)
    {
      id: "detail",
      header: "Detalle",
      cell: ({ row }) => (
        <PaymentDetailDialog
          reference={row.original.reference}
          note={row.original.note}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={10}
      emptyMessage="No se encontraron pagos"
    />
  );
}
