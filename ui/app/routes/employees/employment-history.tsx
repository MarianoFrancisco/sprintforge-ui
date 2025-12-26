import { useLoaderData } from "react-router";
import { employeeService } from "~/services/employees/employee-service";
import { EmploymentHistoryFilter } from "~/components/employees/employment/employment-filters";
import { EmploymentHistoryTable } from "~/components/employees/employment/employment-table";

export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    
    // Parsear parámetros de búsqueda
    const employee = url.searchParams.get("searchTerm") || undefined;
    const position = url.searchParams.get("position") || undefined;
    const type = url.searchParams.get("type") || undefined;
    const startDateFrom = url.searchParams.get("startDateFrom") || undefined;
    const startDateTo = url.searchParams.get("startDateTo") || undefined;
    
    // Transformar "all" a undefined
    const filters = {
      employee,
      position,
      type: type && type !== "all" ? type as any : undefined,
      startDateFrom,
      startDateTo,
    };

    // Obtener historiales
    const histories = await employeeService.getAllHistories(filters);
    
    return {
      histories,
      filters,
    };
  } catch (error) {
    console.error("Error al cargar historiales laborales:", error);
    return {
      histories: [],
      filters: {},
    };
  }
}

export default function EmploymentHistoryPage() {
  const { histories } = useLoaderData<typeof loader>();

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Historial Laboral</h1>
        <p className="text-muted-foreground">
          Registro de cambios en la situación laboral de los empleados.
        </p>
      </header>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:gap-4 w-full">
        <div className="flex-1">
          <EmploymentHistoryFilter />
        </div>
        
      </div>

      {/* Tabla */}
      <EmploymentHistoryTable data={histories} />
    </section>
  );
}
