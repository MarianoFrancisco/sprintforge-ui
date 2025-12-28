import { Link, useLoaderData, type MiddlewareFunction } from "react-router";
import type { Route } from "../+types/home";
import { Button } from "~/components/ui/button";
import { employeeService } from "~/services/employees/employee-service";
import { EmployeesTable } from "~/components/employees/employee-table";
import { EmployeeFilter } from "~/components/employees/employee-filters";
import type { EmployeeStatus, EmployeeWorkloadType } from "~/types/employees/employee";
import { permissionMiddleware } from "~/middlewares/permission-middleware";
import { PERMS } from "~/config/permissions";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Empleados" },
    { name: "description", content: "Listado y gestión de empleados" },
  ];
}

export const handle = {
  crumb: "Empleados",
};

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.EMPLOYEE_VIEW], {
    flashMessage: "No tienes permiso para ver Empleados.",
  }),
];

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  
  // Parsear los parámetros del filtro
  const searchTerm = url.searchParams.get("searchTerm") || undefined;
  const position = url.searchParams.get("position") || undefined;
  const workloadType = url.searchParams.get("workloadType") as EmployeeWorkloadType | undefined;
  const status = url.searchParams.get("status") as EmployeeStatus | undefined;

  // Construir el objeto de filtros
  const filters = {
    searchTerm,
    position,
    workloadType,
    status,
  };
  // Obtener empleados filtrados
  const employees = await employeeService.getAll(filters);

  return {
    employees,
    filters
  };
}

export default function EmployeesPage() {
  const { employees } = useLoaderData<typeof loader>();

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Empleados</h1>
        <p className="text-muted-foreground">
          Gestiona los empleados registrados en el sistema.
        </p>
      </header>

      {/* Filtros + botón crear */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:gap-4 w-full">
        <div className="flex-1">
          <EmployeeFilter />
        </div>

        <div className="flex lg:justify-start justify-end mt-4 lg:mt-0">
          <Button asChild>
            <Link to="/employees/hire">Contratar empleado</Link>
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <EmployeesTable data={employees} />
    </section>
  );
}