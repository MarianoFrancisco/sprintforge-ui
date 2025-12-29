// ~/routes/projects/payments/history.tsx
import { useLoaderData, type MiddlewareFunction } from "react-router";
import { ProjectPaymentFilters } from "~/components/scrum/project/payment/project-payment-filters";
import { ProjectPaymentsTable } from "~/components/scrum/project/payment/project-payment-table";
import { PERMS } from "~/config/permissions";
import { permissionMiddleware } from "~/middlewares/permission-middleware";
import { projectPaymentService } from "~/services/scrum/project-payment-service";
import type { GetAllPaymentsQuery, PaymentMethod } from "~/types/scrum/project-payment";

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware(
    [PERMS.PROJECT_VIEW, PERMS.PROJECT_VIEW_PAYMENT_HISTORY],
    {
      flashMessage: "No tienes permiso para ver el historial de pagos de Proyectos.",
    }
  ),
];

export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);

    // Parámetros
    const searchTerm = url.searchParams.get("searchTerm")?.trim() || undefined;
    const projectId = url.searchParams.get("projectId") || undefined;
    const method = (url.searchParams.get("method") as PaymentMethod | null) || undefined;
    const fromDate = url.searchParams.get("fromDate") || undefined;
    const toDate = url.searchParams.get("toDate") || undefined;

    const filters: GetAllPaymentsQuery = {
      searchTerm,
      projectId,
      method,
      fromDate,
      toDate,
    };

    const payments = await projectPaymentService.getAll(filters);

    return { payments, filters };
  } catch (error) {
    console.error("Error al cargar pagos de proyectos:", error);
    return { payments: [], filters: {} };
  }
}

export default function ProjectPaymentsHistoryPage() {
  const { payments } = useLoaderData<typeof loader>();

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Pagos de Proyectos</h1>
        <p className="text-muted-foreground">
          Historial de pagos registrados para proyectos.
        </p>
      </header>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:gap-4 w-full">
        <div className="flex-1">
          <ProjectPaymentFilters payments={payments} />
        </div>

        {/* Acciones adicionales (opcional) */}
        {/* <div className="flex lg:justify-start justify-end mt-4 lg:mt-0">
          <Button variant="outline">Exportar</Button>
        </div> */}
      </div>

      {/* Tabla */}
      <ProjectPaymentsTable data={payments} />
    </section>
  );
}
