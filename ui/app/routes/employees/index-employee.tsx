import { Link, useLoaderData } from "react-router";
import type { Route } from "../+types/home";

import { Button } from "~/components/ui/button";

import type {
  EmployeeResponseDTO,
  FindEmployeesRequest,
} from "~/types/employees/employee";

import { employeeService } from "~/services/employees/employee-service";
import { EmployeesTable } from "~/components/employees/employee-table";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Empleados" },
    { name: "description", content: "Listado y gestión de empleados" },
  ];
}

export const handle = {
  crumb: "Empleados",
};

/**
 * Loader
 * - Lee query params opcionales
 * - Construye el DTO solo con valores válidos
 * - Retorna la lista de empleados
 */
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const filters: FindEmployeesRequest = {};

//   const q = searchParams.get("q");
//   if (q?.trim()) {
//     filters.q = q.trim();
//   }

//   const department = searchParams.get("department");
//   if (department?.trim()) {
//     filters.department = department.trim();
//   }

//   const isActive = searchParams.get("isActive");
//   if (isActive && isActive !== "all") {
//     filters.isActive = isActive === "true";
//   }

  try {
    const employees = await employeeService.getAll(filters);
    return employees;
  } catch (error) {
    console.error("Error al cargar empleados:", error);
    return [];
  }
}

export default function EmployeesPage() {
  const employees = useLoaderData<typeof loader>() as EmployeeResponseDTO[];

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Empleados</h1>
        <p className="text-muted-foreground">
          Gestiona los empleados registrados en el sistema.
        </p>
      </header>

      {/* Acciones superiores */}
      <div className="flex justify-end">
        <Button asChild>
          <Link to="/employees/hire">Contratar empleado</Link>
        </Button>
      </div>

      {/* Tabla */}
      <EmployeesTable data={employees} />
    </section>
  );
}
