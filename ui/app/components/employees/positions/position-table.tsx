import {
    ArrowUpDown,
    Pencil,
    CheckCircle2,
    XCircle,
    Activity,
    BadgeInfo,
    EllipsisVertical,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import type { PositionResponseDTO } from "~/types/employees/position";
import { useFetcher, useNavigate } from "react-router";
import { DataTable } from "~/components/common/data-table";
import { StatusBadge } from "~/components/common/status-badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";

interface PositionsTableProps {
    data: PositionResponseDTO[];
}

export function PositionsTable({ data }: PositionsTableProps) {
    const navigate = useNavigate();
    const fetcher = useFetcher();

    const handleActivation = (id: string, activate: boolean) => {
        fetcher.submit(
            {
                id,
                activate: String(activate),
                redirectTo: "/employees/positions",
            },
            {
                method: "POST",
                action: `/employees/positions/${id}/action`,
            }
        );
    };

    const columns: ColumnDef<PositionResponseDTO>[] = [
        // Nombre
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="flex items-center gap-2 font-semibold"
                >
                    <BadgeInfo className="h-4 w-4" />
                    Nombre
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            ),
            cell: (info) => info.getValue(),
        },

        // Descripción
        {
            accessorKey: "description",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="flex items-center gap-2 font-semibold"
                >
                    <BadgeInfo className="h-4 w-4" />
                    Descripción
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            ),
            cell: (info) => info.getValue() || "—",
        },

        // Estado
        {
            accessorKey: "isActive",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="flex items-center gap-2 font-semibold"
                >
                    <Activity className="h-4 w-4" />
                    Estado
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            ),
            cell: ({ getValue }) => (
                <StatusBadge status={Boolean(getValue())} />
            ),
        },

        // Acciones
        {
            id: "actions",
            cell: ({ row }) => {
                const position = row.original;
                const isActive = position.isActive;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                                size="icon"
                            >
                                <EllipsisVertical />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => navigate(`/employees/positions/${position.id}/edit`)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActivation(position.id, !isActive)} >{isActive ? "Desactivar" : "Activar"}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => navigate(`/employees/positions/${position.id}/delete`)} >Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return <DataTable data={data} columns={columns} pageSize={10} />;
}
