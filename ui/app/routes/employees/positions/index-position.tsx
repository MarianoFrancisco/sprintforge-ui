import { Link, useLoaderData } from "react-router";
import { PositionFilter } from "~/components/employees/positions/position-filter";
import { PositionsTable } from "~/components/employees/positions/position-table";
import { Button } from "~/components/ui/button";
import { positionService } from "~/services/employees/position-service";
import type { FindPositionsRequest, PositionResponseDTO } from "~/types/employees/position";

export function meta() {
  return [
    { title: "Puestos" },
    { name: "description", content: "Listado de puestos" },
  ];
}

export const handle = {
  crumb: "Listado de puestos",
};

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const filters: FindPositionsRequest = {};

  if (params.searchTerm && params.searchTerm.trim() !== "") {
    filters.searchTerm = params.searchTerm.trim();
  }

  if (params.isActive && params.isActive !== "all") {
    filters.isActive = params.isActive === "true";
  }

  if (params.isDeleted && params.isDeleted !== "all") {
    filters.isDeleted = params.isDeleted === "true";
  }

  try {
    const positions = await positionService.getAll(filters);
    return Response.json(positions);
  } catch (error) {
    console.error("Error al cargar posiciones:", error);
    return Response.json([], { status: 500 });
  }
}

export default function PositionsPage() {
  const positions = useLoaderData<typeof loader>() as PositionResponseDTO[];

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Puestos</h1>
        <p className="text-muted-foreground">
          Gestiona los puestos registrados en el sistema.
        </p>
      </div>

      {/* Filtros + botón crear */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:gap-4 w-full">
        <div className="flex-1">
          <PositionFilter />
        </div>

        <div className="flex lg:justify-start justify-end">
          <Button asChild>
            <Link to="/employees/positions/create">Nuevo Puesto</Link>
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <PositionsTable
        data={positions}
      />
    </section>
  );
}
