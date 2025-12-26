import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Card, CardHeader, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { EmployeeResponseDTO } from "~/types/employees/employee";
import { formatGTQ } from "~/util/currency-formatter";

interface EmployeeCardProps {
  employee: EmployeeResponseDTO;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <Card className="w-full max-w-sm">
      {/* Header con foto y puesto */}
      <CardHeader className="flex flex-col items-center gap-3 p-4">
        <Avatar className="h-28 w-28 border border-gray-200">
          {employee.profileImage ? (
            <AvatarImage src={employee.profileImage} />
          ) : (
            <AvatarFallback>{employee.fullName[0]}</AvatarFallback>
          )}
        </Avatar>

        <h2 className="text-2xl font-semibold text-center">{employee.fullName}</h2>

        <Badge variant="secondary" className="text-sm">
          {employee.position.name}
        </Badge>
      </CardHeader>

      {/* Contenido: salario */}
      <CardContent className="text-center">
        <p className="text-sm text-gray-500">Salario</p>
        <p className="text-xl font-semibold">{formatGTQ(employee.salary)}</p>
      </CardContent>

    </Card>
  );
}
