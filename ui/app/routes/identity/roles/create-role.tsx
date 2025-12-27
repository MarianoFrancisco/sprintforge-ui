import { useEffect } from "react";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
  useActionData,
  useNavigate,
} from "react-router";
import { toast } from "sonner";
import type { Permission } from "~/components/identity/permission/permission-selector";
import { RoleForm } from "~/components/identity/roles/role-form";
import { permissionService } from "~/services/identity/permission-service";
import { roleService } from "~/services/identity/role-service";
import type { CreateRoleRequest } from "~/types/identity/role";

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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const payload: CreateRoleRequest = {
    name: String(formData.get("name")),
    description: formData.get("description")
      ? String(formData.get("description"))
      : undefined,
    permissionIds: JSON.parse(
      String(formData.get("permissions") ?? "[]")
    ),
  };

  await roleService.create(payload);

  return {success: "Rol creado exitosamente"};
}


export default function CreateRolePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const navigate = useNavigate();

    useEffect(() => {
        if (actionData?.error) {
            toast.error(actionData.error);
        }
        if (actionData?.success) {
            toast.success(actionData.success, {
                action: {
                    label: "Ver roles",
                    onClick: () => navigate("/identity/roles"),
                },
            });
        }
    }, [actionData, navigate]);

  return (
    <section className="p-6">
      <RoleForm permissions={data.permissions} />
    </section>
  );
}
