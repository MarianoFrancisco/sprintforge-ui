import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { extractInitials } from "~/lib/employee-initials"
import { cn } from "~/lib/utils"
import type { EmployeeResponseDTO } from "~/types/employees/employee"

export function EmployeeItem({
  employee,
  right,
  className,
}: {
  employee: Pick<EmployeeResponseDTO, "fullName" | "email" | "profileImage">
  right?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar className="h-8 w-8 rounded-md">
        {employee.profileImage ? (
          <AvatarImage src={employee.profileImage} alt={employee.fullName} />
        ) : null}
        <AvatarFallback className="rounded-md">{extractInitials(employee.fullName)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{employee.fullName}</div>
        <div className="truncate text-xs text-muted-foreground">{employee.email}</div>
      </div>

      {right}
    </div>
  )
}