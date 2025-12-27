// ~/routes/roles/index.tsx
import { Link, useLoaderData } from "react-router";
import { RoleFilter } from "~/components/identity/roles/role-filters";
import { RolesTable } from "~/components/identity/roles/roles-table";
import { Button } from "~/components/ui/button";
import { roleService } from "~/services/identity/role-service";
import type { FindRolesRequest, RoleResponseDTO } from "~/types/identity/role";

export function meta() {
  return [
    { title: "Roles" },
    { name: "description", content: "Gestión de roles del sistema" },
  ];
}

export const handle = {
  crumb: "Listado de roles",
};

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const filters: FindRolesRequest = {};

  if (params.searchTerm && params.searchTerm.trim() !== "") {
    filters.searchTerm = params.searchTerm.trim();
  }

  if (params.isActive && params.isActive !== "all") {
    filters.isActive = params.isActive === "true";
  }

  try {
    const roles = await roleService.getAll(filters);
    return Response.json(roles);
  } catch (error) {
    console.error("Error al cargar roles:", error);
    return Response.json([], { status: 500 });
  }
}

export default function RolesPage() {
  const roles = useLoaderData<typeof loader>() as RoleResponseDTO[];

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
        <p className="text-muted-foreground">
          Gestiona los roles y permisos del sistema.
        </p>
      </div>

      {/* Filtros + botón crear */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:gap-4 w-full">
        <div className="flex-1">
          <RoleFilter />
        </div>

        <div className="flex lg:justify-start justify-end">
          <Button asChild>
            <Link to="/identity/roles/create">Nuevo Rol</Link>
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <RolesTable data={roles} />
    </section>
  );
}