// ~/components/employees/payments/employee-payments-table.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { DataTable } from "~/components/common/data-table";
import { DataTableColumnHeader } from "~/components/common/data-table-column-header";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { formatGTQ } from "~/util/currency-formatter";
import type { PaymentResponseDTO } from "~/types/employees/employee-payment";

interface EmployeePaymentsTableProps {
  data: PaymentResponseDTO[];
}

// Dialog para mostrar notas
function NotesDialog({ notes }: { notes?: string }) {
  const hasNotes = !!notes && notes.trim() !== "";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <Eye className="h-4 w-4 mr-1" />
          Ver
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notas</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {hasNotes ? (
            <div className="rounded-lg border p-4">
              <p className="whitespace-pre-wrap text-sm">{notes}</p>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>No hay notas registradas</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EmployeePaymentsTable({ data }: EmployeePaymentsTableProps) {
  const columns: ColumnDef<PaymentResponseDTO>[] = [
    // Fecha
    {
      accessorKey: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return date || "—";
      },
    },

    // CUI
    {
      accessorKey: "cui",
      header: ({ column }) => <DataTableColumnHeader column={column} title="CUI" />,
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">{getValue() as string}</span>
      ),
    },

    // Empleado
    {
      accessorKey: "fullName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Empleado" />,
      cell: ({ getValue }) => <span className="truncate">{getValue() as string}</span>,
    },

    // Cargo
    {
      accessorKey: "positionName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Cargo" />,
      cell: ({ getValue }) => <span className="truncate">{getValue() as string}</span>,
    },

    // Salario base
    {
      accessorKey: "baseSalary",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Salario base" />
      ),
      cell: ({ getValue }) => (
        <span className="font-mono font-medium">{formatGTQ(Number(getValue()))}</span>
      ),
    },

    // Bono
    {
      accessorKey: "bonus",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Bono" />,
      cell: ({ getValue }) => (
        <span className="font-mono">{formatGTQ(Number(getValue() ?? 0))}</span>
      ),
    },

    // Descuento
    {
      accessorKey: "deduction",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descuento" />
      ),
      cell: ({ getValue }) => (
        <span className="font-mono">{formatGTQ(Number(getValue() ?? 0))}</span>
      ),
    },

    // Total
    {
      accessorKey: "total",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
      cell: ({ getValue }) => (
        <span className="font-mono font-semibold">{formatGTQ(Number(getValue()))}</span>
      ),
    },

    // Notas
    {
      id: "notes",
      header: "Notas",
      cell: ({ row }) => <NotesDialog notes={row.original.notes} />,
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
