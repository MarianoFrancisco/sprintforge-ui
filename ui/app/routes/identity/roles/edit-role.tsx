// routes/identity/roles/edit-role.tsx
import { useEffect } from "react";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
  useActionData,
  useNavigate,
} from "react-router";
import { toast } from "sonner";
import { ApiError } from "~/lib/api-client";

import type { Permission } from "~/components/identity/permission/permission-selector";
import { RoleForm } from "~/components/identity/roles/role-form";

import { permissionService } from "~/services/identity/permission-service";
import { roleService } from "~/services/identity/role-service";

import type { UpdateRoleRequest, RoleResponseDTO } from "~/types/identity/role";

export function meta() {
  return [{ title: "Editar rol" }];
}

// Loader: obtiene permisos + rol por id
export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw new Error("ID del rol no proporcionado");

  try {
    const [permissions, role] = await Promise.all([
      permissionService.getAll() as Promise<Permission[]>,
      roleService.getById(id) as Promise<RoleResponseDTO>,
    ]);

    const defaultRole = {
      id: role.id,
      name: role.name,
      description: role.description,
      isDefault: role.isDefault,
      permissions: (role.permissions ?? []).map((p: any) => String(p.id)),
    };

    return { permissions, defaultRole };
  } catch (error) {
    console.error("Error al cargar datos para editar rol", error);
    return { permissions: [], defaultRole: undefined };
  }
}

// Action: actualiza rol (sin validaciones frontend, solo retorna errores del backend)
export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  if (!id) throw new Error("ID del rol no proporcionado");

  const formData = await request.formData();

  try {
    const payload: UpdateRoleRequest = {
      name: String(formData.get("name")),
      description: formData.get("description")
        ? String(formData.get("description"))
        : undefined,
      permissionIds: JSON.parse(String(formData.get("permissions") ?? "[]")),
    };

    await roleService.update(id, payload);

    return { success: "Rol actualizado exitosamente" };
  } catch (error: any) {
    console.log("error en action edit role", error);

    if (error instanceof ApiError && error.response) {
      try {
        const errorData = (error.response as any).data || error.response;

        return {
          errors: errorData.errors || {},
          error: errorData.detail || errorData.message || `Error ${error.status}`,
        };
      } catch (parseError) {
        return { error: `Error ${error.status}: No se pudo procesar la respuesta` };
      }
    }

    return { error: error.message || "Error al actualizar el rol" };
  }
}

export default function EditRolePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined;

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
      <RoleForm permissions={data.permissions} defaultRole={data.defaultRole} />
    </section>
  );
}
