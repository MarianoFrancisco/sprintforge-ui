import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { extractInitials } from "~/lib/employee-initials";
import type { EmployeeResultResponseDTO } from "~/types/scrum/project";

export interface EmployeesAvatarStackProps {
  employees: EmployeeResultResponseDTO[];
  maxVisible?: number;
  size?: "sm" | "md";
  className?: string;
}

export function EmployeesAvatarStack({
  employees,
  maxVisible = 5,
  size = "md",
  className,
}: EmployeesAvatarStackProps) {
  if (!employees?.length) return null;

  const visible = employees.slice(0, maxVisible);
  const extraCount = employees.length - visible.length;

  const avatarSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const fallbackText = size === "sm" ? "text-[9px]" : "text-[10px]";
  const plusText = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <TooltipProvider>
      <div className={cn("flex -space-x-2", className)}>
        {visible.map((emp) => (
          <Tooltip key={emp.id} delayDuration={150}>
            <TooltipTrigger asChild>
              <Avatar
                className={cn(
                  avatarSize,
                  "ring-2 ring-background transition-all",
                  "hover:z-10 hover:scale-110"
                )}
              >
                {emp.profileImage ? (
                  <AvatarImage src={emp.profileImage} alt={emp.fullName} />
                ) : null}
                <AvatarFallback className={fallbackText}>
                  {extractInitials(emp.fullName)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>

            <TooltipContent>
              <p className="text-xs">{emp.fullName}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {extraCount > 0 && (
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <Avatar
                className={cn(
                  avatarSize,
                  "ring-2 ring-background transition-all",
                  "bg-muted text-muted-foreground",
                  "hover:z-10 hover:scale-110"
                )}
              >
                <AvatarFallback className={cn("font-medium", plusText)}>
                  +{extraCount}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>

            <TooltipContent>
              <p className="text-xs">{extraCount} empleados más</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
