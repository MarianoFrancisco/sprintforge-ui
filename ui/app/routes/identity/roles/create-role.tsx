// app/routes/roles/create-role.tsx
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
} from "react-router";
import type { Permission } from "~/components/identity/permission/permission-selector";
import { RoleForm } from "~/components/identity/roles/role-form";
import { permissionService } from "~/services/identity/permission-service";

// Loader: obtiene permisos desde la base de datos
export async function loader({}: LoaderFunctionArgs) {
  try {
    const permissions: Permission[] = await permissionService.getAll();
    return { permissions };
  } catch (error) {
    console.error("Error al cargar permisos", error);
    return { permissions: [] };
  }
}

// Action: solo imprime la información del formulario
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const payload = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) ?? "",
    isDefault: formData.get("isDefault") === "on",
    permissions: JSON.parse((formData.get("permissions") as string) || "[]"),
  };

  console.log("CREATE ROLE PAYLOAD:", payload);

  // Aquí normalmente llamarías al servicio para crear roles
  // await roleService.create(payload);

  return null;
}

export default function CreateRolePage() {
  const data = useLoaderData<typeof loader>();

  return (
    <section className="p-6">
      <RoleForm permissions={data.permissions} />
    </section>
  );
}
