import { Badge } from "~/components/ui/badge";

interface MedicineStatusBadgeProps {
  status: boolean,
  trueLabel?: string,
  falseLabel?: string,
}

export function StatusBadge({ status, trueLabel, falseLabel }: MedicineStatusBadgeProps) {
  const base = "px-2 py-1 font-medium";

  switch (status) {
    case true:
      return (
        <Badge
          variant="default"
        >
          {trueLabel ?? "Activo"}
        </Badge>
      );

    case false:
      return (
        <Badge
          variant="destructive"
        >
          {falseLabel ?? "Desactivado"}
        </Badge>
      );

    default:
      return (
        <Badge
          className={`${base} bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-100`}
        >
          {status}
        </Badge>
      );
  }
}
