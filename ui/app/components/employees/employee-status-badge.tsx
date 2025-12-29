// employee-status-badge.tsx
import { Badge } from "~/components/ui/badge";
import { CheckIcon, AlertCircleIcon } from "lucide-react";

import type { EmployeeStatus } from "~/types/employees/employee";

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
}

export function EmployeeStatusBadge({ status }: EmployeeStatusBadgeProps) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge className="flex items-center gap-1">
          <CheckIcon className="h-3.5 w-3.5" />
          Activo
        </Badge>
      );

    case "SUSPENDED":
      return (
        <Badge
          variant="secondary"
          className="flex items-center gap-1"
        >
          <AlertCircleIcon className="h-3.5 w-3.5" />
          Suspendido
        </Badge>
      );

    case "TERMINATED":
      return (
        <Badge
          variant="destructive"
          className="flex items-center gap-1"
        >
          <AlertCircleIcon className="h-3.5 w-3.5" />
          Terminado
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
}
