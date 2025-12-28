import {
    Pencil,
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
import { DataTableColumnHeader } from "~/components/common/data-table-column-header";
import { PositionActions } from "./position-actions";

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
                <DataTableColumnHeader column={column} title="Nombre" icon={<BadgeInfo />} />
            ),
            cell: (info) => info.getValue(),
        },

        // Descripción
        {
            accessorKey: "description",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Descripción" icon={<Pencil />} />
            ),
            cell: (info) => info.getValue() || "—",
        },

        // Estado
        {
            accessorKey: "isActive",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Estado" icon={<Activity />} />
            ),
            cell: ({ getValue }) => (
                <StatusBadge status={Boolean(getValue())} />
            ),
        },

        // Acciones
        {
            id: "actions",
            header: () => <span>Acciones</span>,
            cell: ({ row }) => <PositionActions position={row.original} />,
        }

    ];

    return <DataTable data={data} columns={columns} pageSize={10} />;
}
