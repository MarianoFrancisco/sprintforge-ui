// ~/routes/identity/users/index.tsx
import { useLoaderData } from "react-router";
import { UserFilter } from "~/components/identity/users/user-filters";
import { UsersTable } from "~/components/identity/users/users-table";
import { userService } from "~/services/identity/user-service";
import type { GetAllUsersQuery } from "~/types/identity/user";
import type { UserResponseDTO } from "~/types/identity/user";

export function meta() {
  return [
    { title: "Usuarios" },
    { name: "description", content: "Gestión de usuarios del sistema" },
  ];
}

export const handle = {
  crumb: "Listado de usuarios",
};

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const filters: GetAllUsersQuery = {};

  if (params.searchTerm && params.searchTerm.trim() !== "") {
    filters.searchTerm = params.searchTerm.trim();
  }

  if (params.status && params.status !== "all") {
    filters.status = params.status;
  }

  try {
    const users = await userService.getAll(filters);
    return Response.json(users);
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    return Response.json([], { status: 500 });
  }
}

export default function UsersPage() {
  const users = useLoaderData<typeof loader>() as UserResponseDTO[];

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">
          Administra los usuarios y sus roles.
        </p>
      </div>

      {/* Filtros (sin botón crear) */}
      <div className="w-full">
        <UserFilter />
      </div>

      {/* Tabla */}
      <UsersTable data={users} />
    </section>
  );
}
