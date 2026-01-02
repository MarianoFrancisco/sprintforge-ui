import { useEffect } from "react";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
  useActionData,
  useNavigate,
  type MiddlewareFunction,
  redirect,
  data,
} from "react-router";
import { toast } from "sonner";
import type { Permission } from "~/components/identity/permission/permission-selector";
import { RoleForm } from "~/components/identity/roles/role-form";
import { PERMS } from "~/config/permissions";
import { permissionMiddleware } from "~/middlewares/permission-middleware";
import { permissionService } from "~/services/identity/permission-service";
import { roleService } from "~/services/identity/role-service";
import { commitAuthSession, getAuthSession } from "~/sessions.server";
import type { CreateRoleRequest } from "~/types/identity/role";

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.ROLE_CREATE], {
    flashMessage: "No tienes permiso para crear Roles.",
  }),
];

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
  const session = await getAuthSession(request);
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

  try {
    await roleService.create(payload);
    session.flash("success", "Rol creado exitosamente.");
    return redirect("/identity/roles", {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    });
  } catch (error: any) {
    session.flash("error", error?.response?.detail || "Error al crear el rol.");
    return data({errors: error?.response?.errors || {}}, {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    });
  }
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
