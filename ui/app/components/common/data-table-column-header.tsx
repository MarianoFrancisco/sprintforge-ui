import type { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react"
import { cn } from "~/lib/utils"
import { Button } from "../ui/button"

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
    icon?: React.ReactNode
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
    icon
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                {icon && <span>{icon}</span>}
                <span>{title}</span>
                {column.getIsSorted() === "desc" ? (
                    <ArrowDown />
                ) : column.getIsSorted() === "asc" ? (
                    <ArrowUp />
                ) : (
                    <ChevronsUpDown />
                )}
            </Button>
        </div>
    )
}
