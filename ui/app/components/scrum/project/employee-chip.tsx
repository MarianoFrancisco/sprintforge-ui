import { X } from "lucide-react"
import { cn } from "~/lib/utils"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import type { EmployeeResponseDTO } from "~/types/employees/employee"
import { extractInitials } from "~/lib/employee-initials"

export interface EmployeeChipProps {
  employee: Pick<EmployeeResponseDTO, "id" | "email" | "fullName" | "profileImage">
  onRemove?: (id: string) => void
  showRemoveButton?: boolean
  disabled?: boolean
  className?: string
}

export function EmployeeChip({
  employee,
  onRemove,
  showRemoveButton = true,
  disabled,
  className,
}: EmployeeChipProps) {
  const canRemove = showRemoveButton && typeof onRemove === "function"

  return (
    <Badge
      variant="secondary"
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1",
        className
      )}
    >
      <Avatar className="h-5 w-5 rounded-md">
        {employee.profileImage ? (
          <AvatarImage src={employee.profileImage} alt={employee.fullName} />
        ) : null}
        <AvatarFallback className="rounded-md text-[10px]">
          {extractInitials(employee.fullName)}
        </AvatarFallback>
      </Avatar>

      <span className="max-w-[220px] truncate text-xs">
        {employee.email}
      </span>

      {canRemove ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-5 w-5 rounded-md"
          onClick={() => onRemove!(employee.id)}
          disabled={disabled}
          aria-label={`Quitar ${employee.email}`}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      ) : null}
    </Badge>
  )
}
