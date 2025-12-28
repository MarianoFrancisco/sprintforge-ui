// ~/components/employees/employment-history/employment-history-table.tsx
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
import { Badge } from "~/components/ui/badge";
import { formatGTQ } from "~/util/currency-formatter";
import type { 
  EmploymentHistoryResponseDTO, 
  EmploymentHistoryType 
} from "~/types/employees/employment-history";
import { MoneyCell } from "~/components/common/money-cell";

interface EmploymentHistoryTableProps {
  data: EmploymentHistoryResponseDTO[];
}

// Componente para mostrar las notas en un dialog
function NotesDialog({ notes }: { notes: string }) {
  const hasNotes = notes && notes.trim() !== "";
  
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

// Componente para mostrar el badge del tipo
function HistoryTypeBadge({ type }: { type: EmploymentHistoryType }) {
  const typeLabels = {
    HIRING: "Contratación",
    SALARY_INCREASE: "Aumento",
    SUSPENSION: "Suspensión",
    REINSTATEMENT: "Reincorporación",
    TERMINATION: "Terminación",
  };

  return (
    <Badge variant="secondary">
      {typeLabels[type] || type}
    </Badge>
  );
}

export function EmploymentHistoryTable({ data }: EmploymentHistoryTableProps) {
  const columns: ColumnDef<EmploymentHistoryResponseDTO>[] = [
    // CUI del empleado
    {
      accessorKey: "employeeCui",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CUI" />
      ),
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">
          {getValue() as string}
        </span>
      ),
    },

    // Nombre completo del empleado
    {
      accessorKey: "employeeFullname",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Empleado" />
      ),
    },

    // Cargo
    {
      accessorKey: "positionName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cargo" />
      ),
    },

    // Tipo de historial
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo" />
      ),
      cell: ({ getValue }) => (
        <HistoryTypeBadge type={getValue() as EmploymentHistoryType} />
      ),
    },

    // Fecha de inicio
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Inicio" />
      ),
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return date || "—";
      },
    },

    // Fecha fin
    {
      accessorKey: "endDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fin" />
      ),
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return date || "—";
      },
    },

    // Salario
    {
      accessorKey: "salary",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Salario" />
      ),
      cell: ({ getValue }) => {
        const salary = getValue() as string;
        return (
          <MoneyCell value={Number(salary)} />
        );
      },
    },

    // Acciones (Ver notas)
    {
      id: "actions",
      header: "Notas",
      cell: ({ row }) => {
        return <NotesDialog notes={row.original.notes} />;
      },
    },
  ];

  return (
    <DataTable 
      data={data} 
      columns={columns} 
      pageSize={10}
      emptyMessage="No se encontraron registros de historial laboral"
    />
  );
}