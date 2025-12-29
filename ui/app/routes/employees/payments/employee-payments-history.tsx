// ~/routes/employees/payments/index.tsx
import { useLoaderData, type MiddlewareFunction } from "react-router";
import { EmployeePaymentsFilter } from "~/components/employees/payments/employee-payments-filters";
import { EmployeePaymentsTable } from "~/components/employees/payments/employee-payments-table";
import { PERMS } from "~/config/permissions";
import { permissionMiddleware } from "~/middlewares/permission-middleware";
import { employeePaymentService } from "~/services/employees/employee-payment-service";

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.EMPLOYEE_VIEW, PERMS.EMPLOYEE_VIEW_PAYMENT_HISTORY], {
    flashMessage: "No tienes permiso para ver el historial de pagos de Empleados."
  }),
];

export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    
    // Parsear parámetros de búsqueda
    const employee = url.searchParams.get("searchTerm") || undefined;
    const position = url.searchParams.get("position") || undefined;
    const fromDate = url.searchParams.get("fromDate") || undefined;
    const toDate = url.searchParams.get("toDate") || undefined;
    
    const filters = {
      employee,
      position,
      fromDate,
      toDate,
    };

    // Obtener pagos
    const payments = await employeePaymentService.getAll(filters);
    
    return {
      payments,
      filters,
    };
  } catch (error) {
    console.error("Error al cargar pagos:", error);
    return {
      payments: [],
      filters: {},
    };
  }
}

export default function EmployeePaymentsPage() {
  const { payments } = useLoaderData<typeof loader>();

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Pagos de Empleados</h1>
        <p className="text-muted-foreground">
          Registro de pagos realizados a los empleados.
        </p>
      </header>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:gap-4 w-full">
        <div className="flex-1">
          <EmployeePaymentsFilter />
        </div>
        
        {/* Si necesitas botones adicionales como exportar */}
        {/* <div className="flex lg:justify-start justify-end mt-4 lg:mt-0">
          <Button variant="outline">
            Exportar
          </Button>
        </div> */}
      </div>

      {/* Tabla */}
      <EmployeePaymentsTable data={payments} />
    </section>
  );
}